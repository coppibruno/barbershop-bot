import moment from 'moment';
import {Meetings} from '@prisma/client';

import {FlowContext} from '../../flow.context';

//errors
import {
  InvalidDateError,
  RetryNewAppointmentDate,
  MEETING_ALREDY_IN_USE,
  NotFoundError,
  InvalidDataIsProvidedError,
  InvalidMenuOptionError,
} from '@/errors';

//services
import {
  FindConversationsService,
  GetUserNameConversation,
  GetPhoneByAccountIdConversation,
} from '@/services';
import {StepFindAvaliableDateFlow} from './step-04-find-avaliable-date.service';

//helpers
import {
  ValidateIfIsDezemberHelper,
  PadStartDateHelper,
  TransformSampleObjectInFormattedArrayHelper,
  ConvertIntervalTimeInObject,
} from '@/helpers';

import {IFlowResult} from '@/interfaces/flow';

import {MeetingRepository} from '@/repositories/meeting.repository';
import {MeetingEntity} from '@/entity/meeting.entity';

interface AppointmentDate {
  startedDate: Date;
}

export enum AppointmentResultEnum {
  NEW_APPOINTMENT = 'NEW_APPOINTMENT',
}

type IExtractAppointment =
  | AppointmentDate
  | AppointmentResultEnum.NEW_APPOINTMENT;
interface IOptions {
  option: number;
  appointment: string;
}

export const getClone = (date) => date.clone();
export const getHours = (date) => date.hours();
export const getMins = (date) => date.minutes();
export const setHours = (date, hour) => date.hours(hour);
export const setMinutes = (date, min) => date.minutes(min);
export const setSeconds = (date, sec) => date.seconds(sec);
export const addDate = (date, input, type) => date.add(input, type);

export const RETRY_NEW_APPOINTMENT = () =>
  ValidateIfIsDezemberHelper()
    ? RetryNewAppointmentDate.MAKE_APPOINTMENT_DEZEMBER
    : RetryNewAppointmentDate.MAKE_APPOINTMENT;

export const INVALID_DATE = () =>
  ValidateIfIsDezemberHelper()
    ? InvalidDateError.INVALID_DATE_DEZEMBER
    : InvalidDateError.INVALID_DATE;

/**
 * Etapa responsável por buscar horário selecionado, validar e retornar mensagem de sucesso caso seja.
 */
export class StepGetDateAndReplyAppointmentFlow {
  private readonly findConversationService: FindConversationsService;
  private readonly stepFindAvaliableDateFlow: StepFindAvaliableDateFlow;
  private readonly meetingRepository: MeetingRepository;
  private readonly getUserNameConversation: GetUserNameConversation;
  private readonly getPhoneByAccountIdConversation: GetPhoneByAccountIdConversation;
  private readonly stepCompleted: number = 5;
  private readonly incompleteStep: number = 4;
  private readonly stepDateAppointment: number = 3;
  private readonly msgIncorrectMenuIsProvided = 'invalid menu is provided';

  constructor(
    findConversationService: FindConversationsService,
    stepFindAvaliableDateFlow: StepFindAvaliableDateFlow,
    meetingRepository: MeetingRepository,
    getUserNameConversation: GetUserNameConversation,
    getPhoneByAccountIdConversation: GetPhoneByAccountIdConversation,
  ) {
    this.findConversationService = findConversationService;
    this.stepFindAvaliableDateFlow = stepFindAvaliableDateFlow;
    this.meetingRepository = meetingRepository;
    this.getUserNameConversation = getUserNameConversation;
    this.getPhoneByAccountIdConversation = getPhoneByAccountIdConversation;
  }

  /**
   * Verifica se existe agendamento na data selecionada
   * @param param0 {startDate: data inicio agendamento, endDate: data fim agendamento, phone}
   * @returns Agendamento caso exista ou array vazio
   */
  async findMeetingIsAvaliable({startDate, endDate, phone}): Promise<Meetings> {
    const result = await this.meetingRepository.findOne({
      where: {
        phone,
        startDate,
        endDate,
      },
    });
    return result;
  }

  /**
   * Busca dados e retorna uma entidade de agendamento (meeting)
   * @param accountId account id string
   * @param appointmentTime Horário/min agendamento. Ex: 09:00
   * @returns MeetingEntity
   */
  async getDataToNewMeet(
    accountId: string,
    appointmentTime: string,
  ): Promise<MeetingEntity> {
    const [name, phone, dayMonth] = await Promise.all([
      this.getUserNameConversation.execute(accountId),
      this.getPhoneByAccountIdConversation.execute(accountId),
      this.stepFindAvaliableDateFlow.getDateAppointment(accountId),
    ]);

    const {startDate, endDate} = ConvertIntervalTimeInObject(
      dayMonth,
      appointmentTime,
    );

    const meetingEntity: MeetingEntity = {
      name,
      phone,
      startDate,
      endDate,
    };

    return meetingEntity;
  }

  /**
   * Salva um novo agendamento
   * @param accountId account id String
   * @param appointment Horário/min agendamento. Ex: 09:00
   * @returns Meetings no sucesso ou MEETING_ALREDY_IN_USE caso esteja já marcado
   */
  async saveAppointment(
    accountId: string,
    appointment: string,
  ): Promise<Meetings> {
    const meetingEntity = await this.getDataToNewMeet(accountId, appointment);

    const timeAlreadyMarked = await this.findMeetingIsAvaliable({
      startDate: meetingEntity.startDate,
      endDate: meetingEntity.endDate,
      phone: meetingEntity.phone,
    });

    if (timeAlreadyMarked) {
      throw MEETING_ALREDY_IN_USE;
    }

    return this.meetingRepository.create(meetingEntity);
  }
  /**
   * Busca a opção de agendamento selecionada pelo usuario e traz a lista total junto
   * @param accountId usuario
   * @returns opção selecionada e opções de agendamento total
   */
  async findAppointmentSelected(
    accountId: string,
  ): Promise<{option: number; options: any}> {
    const data = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        step: this.incompleteStep,
        toPhone: Number(FlowContext.BOT_NUMBER),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!data) {
      throw new NotFoundError('Unable fetch scheduled appointment');
    }

    let formattedOption: number;
    try {
      formattedOption = Number(data.body);
    } catch (e: any) {
      console.error(e.message);
      throw new InvalidDataIsProvidedError(
        'invalid number option on select appointment time',
      );
    }

    return {option: formattedOption, options: data.options};
  }
  /**
   * Busca e persiste horário selecioado pelo usuario
   * @param accountId account id string
   * @returns data do horario marcado
   */
  async saveAppointmentMarked(accountId: string): Promise<IExtractAppointment> {
    const {option, options} = await this.findAppointmentSelected(accountId);

    if (option === FlowContext.OPTION_RETRY_DATE_APPOINTMENT) {
      return AppointmentResultEnum.NEW_APPOINTMENT;
    }

    const menuOptions = TransformSampleObjectInFormattedArrayHelper(options);

    const optionExistsInArray = menuOptions.find((i) => i.option === option);

    if (!optionExistsInArray) {
      throw new InvalidDataIsProvidedError(this.msgIncorrectMenuIsProvided);
    }

    const appointmentTime = optionExistsInArray.appointment;

    const meetSaved = await this.saveAppointment(accountId, appointmentTime);

    return {
      startedDate: meetSaved.startDate,
    };
  }

  async execute(accountId: string): Promise<IFlowResult> {
    try {
      const response = await this.saveAppointmentMarked(accountId);
      const {options} = await this.stepFindAvaliableDateFlow.execute(accountId);

      if (response === AppointmentResultEnum.NEW_APPOINTMENT) {
        return {
          response: RETRY_NEW_APPOINTMENT(),
          step: this.stepDateAppointment,
          options,
        };
      }

      const {startedDate} = response;

      const [day, month, year] = [
        PadStartDateHelper(moment(startedDate).date(), 2),
        PadStartDateHelper(moment(startedDate).month() + 1, 2),
        moment(startedDate).year(),
      ];

      const [hours, minutes] = [
        PadStartDateHelper(moment(startedDate).clone().hours(), 2),
        PadStartDateHelper(moment(startedDate).clone().minutes(), 2),
      ];

      let date = `${day}/${month}`;

      if (ValidateIfIsDezemberHelper()) {
        date += `/${year}`;
      }

      const time = `${hours}:${minutes}`;

      return {
        step: this.stepCompleted,
        response: FlowContext.successfulAppointmentMessage(date, time),
      };
    } catch (error) {
      console.error(error);

      const {message} = error;

      if (message === this.msgIncorrectMenuIsProvided) {
        return {
          response: InvalidMenuOptionError.INVALID_MENU_OPTION,
          step: this.incompleteStep,
        };
      }

      const {response, step} = await this.stepFindAvaliableDateFlow.execute(
        accountId,
      );

      return {response, step};
    }
  }
}
