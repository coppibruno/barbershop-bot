import moment, {Moment} from 'moment';
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
  GetProtocolByPhoneConversation,
  GetUserNameConversation,
  SendMessageWhatsappService,
} from '@/services';
import {StepFindAvaliableDateFlow} from './step-04-find-avaliable-date.service';

//helpers
import {
  ValidateIfIsDezemberHelper,
  PadStartDateHelper,
  TransformSampleObjectInFormattedArrayHelper,
  ConvertIntervalTimeInObject,
  TransformAppointmentInDateHelper,
} from '@/helpers';

import {IFlowResult} from '@/interfaces/flow';

import {MeetingRepository} from '@/repositories/meeting.repository';
import {MeetingEntity} from '@/entity/meeting.entity';
import {ConversationEntity} from '@/entity';

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

export const getDay = (date: Moment) => date.date();
export const getMonth = (date: Moment) => date.month() + 1;
export const getClone = (date: Moment): Moment => date.clone();
export const getHours = (date) => date.hours();
export const getMins = (date) => date.minutes();
export const setHours = (date, hour) => date.hours(hour);
export const setMinutes = (date, min) => date.minutes(min);
export const setSeconds = (date, sec) => date.seconds(sec);
export const addDate = (date, input, type) => date.add(input, type);

export const getHoursMin = (date: Moment): string => {
  const hours = PadStartDateHelper(date.hours(), 2);

  const mins = PadStartDateHelper(date.minutes(), 2);

  return `${hours}:${mins}`;
};

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
  private readonly stepCompleted: number = 5;
  private readonly incompleteStep: number = 4;
  private readonly stepDateAppointment: number = 3;
  private readonly msgIncorrectMenuIsProvided = 'invalid menu is provided';
  public readonly appointmentTimeInMinutes =
    FlowContext.APPOINTMENT_TIME_IN_MINUTES;

  constructor(
    private readonly findConversationService: FindConversationsService,
    private readonly stepFindAvaliableDateFlow: StepFindAvaliableDateFlow,
    private readonly meetingRepository: MeetingRepository,
    private readonly getUserNameConversation: GetUserNameConversation,
    private readonly sendMessageWhatsappService: SendMessageWhatsappService,
    private readonly getProtocolByPhoneConversation: GetProtocolByPhoneConversation,
  ) {
    this.findConversationService = findConversationService;
    this.stepFindAvaliableDateFlow = stepFindAvaliableDateFlow;
    this.meetingRepository = meetingRepository;
    this.getUserNameConversation = getUserNameConversation;
    this.sendMessageWhatsappService = sendMessageWhatsappService;
    this.getProtocolByPhoneConversation = getProtocolByPhoneConversation;
  }
  /**
   * Envia uma mensagem para o admin com detalhes do novo agendamento
   * @param meeting Meeting (agendamento)
   */
  private sendMessageToAdminWithNewAppointment(meeting: Meetings): void {
    const {name, phone, startDate} = meeting;

    const conversation: ConversationEntity = {
      name,
      fromPhone: Number(FlowContext.BOT_NUMBER),
      toPhone: Number(FlowContext.ADMIN_NUMBER),
      body: `Novo cliente ${name}(${phone}). Dia ${getDay(
        moment(startDate),
      )}/${PadStartDateHelper(getMonth(moment(startDate)), 2)} às ${getHoursMin(
        moment(startDate),
      )}`,
      accountId: null,
      messageId: null,
      options: null,
      protocol: null,
      state: null,
      step: null,
    };

    this.sendMessageWhatsappService.execute(conversation);
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
   * @param phone telefone do usuario
   * @param appointmentTime Horário/min agendamento. Ex: 09:00
   * @returns MeetingEntity
   */
  async getDataToNewMeet(
    phone: number,
    appointmentTime: string,
  ): Promise<MeetingEntity> {
    const protocol = await this.getProtocolByPhoneConversation.execute(phone);

    const [name, dayMonth] = await Promise.all([
      this.getUserNameConversation.execute(protocol),
      this.stepFindAvaliableDateFlow.getDateAppointment(phone),
    ]);

    let startDate = TransformAppointmentInDateHelper(dayMonth);

    const [hours, mins] = appointmentTime.split(':');

    startDate = setHours(startDate, hours);
    startDate = setMinutes(startDate, mins);

    let endDate = getClone(startDate);

    endDate = getClone(
      addDate(endDate, this.appointmentTimeInMinutes, 'minutes'),
    );

    const meetingEntity: MeetingEntity = {
      name,
      phone,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    };

    return meetingEntity;
  }

  /**
   * Salva um novo agendamento
   * @param phone telefone do usuario
   * @param appointment Horário/min agendamento. Ex: 09:00
   * @returns Meetings no sucesso ou MEETING_ALREDY_IN_USE caso esteja já marcado
   */
  async saveAppointment(phone: number, appointment: string): Promise<Meetings> {
    const meetingEntity = await this.getDataToNewMeet(phone, appointment);

    const timeAlreadyMarked = await this.findMeetingIsAvaliable({
      startDate: meetingEntity.startDate,
      endDate: meetingEntity.endDate,
      phone: meetingEntity.phone,
    });

    if (timeAlreadyMarked) {
      throw MEETING_ALREDY_IN_USE;
    }

    const meetingResult = await this.meetingRepository.create(meetingEntity);
    this.sendMessageToAdminWithNewAppointment(meetingResult);

    return meetingResult;
  }
  /**
   * Busca a opção de agendamento selecionada pelo usuario e traz a lista total junto
   * @param phone telefone do usuario
   * @returns opção selecionada e opções de agendamento total
   */
  async findAppointmentSelected(
    phone: number,
  ): Promise<{option: number; options: any}> {
    const data = await this.findConversationService.findOne({
      where: {
        fromPhone: phone,
        step: this.stepCompleted,
        toPhone: Number(FlowContext.BOT_NUMBER),
        state: 'IN_PROGRESS',
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
   * @param phone telefone do usuario
   * @returns data do horario marcado
   */
  async saveAppointmentMarked(phone: number): Promise<IExtractAppointment> {
    const {option, options} = await this.findAppointmentSelected(phone);

    if (option === FlowContext.OPTION_RETRY_DATE_APPOINTMENT) {
      return AppointmentResultEnum.NEW_APPOINTMENT;
    }

    const menuOptions = TransformSampleObjectInFormattedArrayHelper(options);

    const optionExistsInArray = menuOptions.find((i) => i.option === option);

    if (!optionExistsInArray) {
      throw new InvalidDataIsProvidedError(this.msgIncorrectMenuIsProvided);
    }

    const appointmentTime = optionExistsInArray.appointment;

    const meetSaved = await this.saveAppointment(phone, appointmentTime);

    return {
      startedDate: meetSaved.startDate,
    };
  }

  async execute(phone: number): Promise<IFlowResult> {
    try {
      const response = await this.saveAppointmentMarked(phone);
      const {options} = await this.stepFindAvaliableDateFlow.execute(phone);

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
        state: 'FINISHED',
      };
    } catch (error) {
      console.error(error);
      const {options} = await this.stepFindAvaliableDateFlow.execute(phone);

      const {message} = error;

      if (error === MEETING_ALREDY_IN_USE) {
        //todo tratar esse erro
      }

      if (message === this.msgIncorrectMenuIsProvided) {
        return {
          response: InvalidMenuOptionError.INVALID_MENU_OPTION,
          step: this.incompleteStep,
          options,
        };
      }

      const {response, step} = await this.stepFindAvaliableDateFlow.execute(
        phone,
      );

      return {response, step};
    }
  }
}
