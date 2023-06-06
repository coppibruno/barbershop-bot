import moment, {Moment} from 'moment';
import {Conversations, Meetings} from '@prisma/client';

import {FlowContext} from '../../flow.context';

//errors
import {
  DefaultError,
  STEP_NOT_IMPLEMETED,
  InvalidDateError,
  RetryNewAppointmentDate,
  MEETING_ALREDY_IN_USE,
  NotFoundError,
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
  FetchStartAndEndAppointmentTimeHelper,
  ValidateIfIsDezemberHelper,
  PadStartDateHelper,
  TransformAppointmentInDateHelper,
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
  private readonly timeAppointment = FlowContext.APPOINTMENT_TIME_IN_MINUTES;

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

  findMeetingIsAvaliable = async ({startDate, endDate, phone}) => {
    const result = await this.meetingRepository.find({
      where: {
        phone,
        startDate,
        endDate,
      },
    });
    return result;
  };

  /**
   *
   * @param startOfAppointment Hora/Min agendamento. Ex: 09:00
   * @param startDateAppointment Objeto moment com a data do agendamento
   * @returns Hora inicio e fim do agendamento em formato string. Ex: '09:00 - 10:00'
   */
  getStartAndEndAppointment = (
    startOfAppointment: string,
    startDateAppointment: Moment,
  ): string => {
    const startAppointment = startOfAppointment.split(':');
    const hourStart = startAppointment[0].trim();
    const minStart = startAppointment[1].trim();

    setHours(startDateAppointment, Number(hourStart));
    setMinutes(startDateAppointment, Number(minStart));
    setSeconds(startDateAppointment, 0);

    const endDateAppointment = getClone(startDateAppointment);

    addDate(endDateAppointment, this.timeAppointment, 'minutes');

    const endHourAppointment = PadStartDateHelper(
      getHours(endDateAppointment),
      2,
    );
    const endMinsAppointment = PadStartDateHelper(
      getMins(endDateAppointment),
      2,
    );

    return `${hourStart}:${minStart} - ${endHourAppointment}:${endMinsAppointment}`;
  };

  /**
   *
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

    const startDateAppointment = TransformAppointmentInDateHelper(dayMonth);

    appointmentTime = this.getStartAndEndAppointment(
      appointmentTime,
      startDateAppointment,
    );

    const objStartDateEndDate = FetchStartAndEndAppointmentTimeHelper(
      dayMonth,
      appointmentTime,
    );

    const {startDate, endDate} = objStartDateEndDate;

    const meetingEntity: MeetingEntity = {
      name,
      phone,
      startDate,
      endDate,
    };

    const timeAlreadyMarked = await this.findMeetingIsAvaliable({
      startDate,
      endDate,
      phone,
    });

    if (timeAlreadyMarked.length > 0) {
      throw MEETING_ALREDY_IN_USE;
    }

    return meetingEntity;
  }

  /**
   *
   * @param accountId account id String
   * @param appointment Horário/min agendamento. Ex: 09:00
   * @returns Meetings no sucesso ou try again em caso de algum erro
   */
  async saveAppointment(
    accountId: string,
    appointment: string,
  ): Promise<Meetings> {
    const meetingEntity = await this.getDataToNewMeet(accountId, appointment);

    return this.meetingRepository.create(meetingEntity);
  }

  /**
   *
   * @param options array de opções. Ex: ['09:00', '10:00', '11:00', ...]
   * @returns Array formatado com propriedades de Option e Appointment. Ex: [{option: 1, appointment: '09:00'}, ...]
   */
  extractAppointmentList(options: any): IOptions[] {
    const appointments = Object.values(options).map(String);

    let count = 0;
    const result = appointments.map((description) => {
      count++;
      return {option: count, appointment: description};
    });
    return result;
  }

  async findAppointmentSelected(accountId: string): Promise<Conversations> {
    const appointmentSelected = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        step: this.incompleteStep,
        toPhone: Number(FlowContext.BOT_NUMBER),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!appointmentSelected) {
      throw new NotFoundError('Unable fetch scheduled appointment');
    }

    return appointmentSelected;
  }
  /**
   *
   * @param accountId account id string
   * @returns
   */
  async getAppointmentMarked(accountId: string): Promise<IExtractAppointment> {
    const {body: appointmentSelected, options} =
      await this.findAppointmentSelected(accountId);

    let formattedOption: number;

    try {
      formattedOption = Number(appointmentSelected);
    } catch (e: any) {
      console.error(e.message);
      throw STEP_NOT_IMPLEMETED;
    }

    if (formattedOption === FlowContext.OPTION_RETRY_DATE_APPOINTMENT) {
      return AppointmentResultEnum.NEW_APPOINTMENT;
    }

    const menuOptions = this.extractAppointmentList(options);

    const optionExistsInArray = menuOptions.find(
      (i) => i.option === formattedOption,
    );

    if (!optionExistsInArray) {
      throw STEP_NOT_IMPLEMETED;
    }

    const appointmentTime = optionExistsInArray.appointment;

    const meetSaved = await this.saveAppointment(accountId, appointmentTime);

    return {
      startedDate: meetSaved.startDate,
    };
  }

  async execute(accountId: string): Promise<IFlowResult> {
    const result: IFlowResult = {
      response: DefaultError.TRY_AGAIN,
      step: this.incompleteStep,
      options: [],
    };

    try {
      const appointment = await this.getAppointmentMarked(accountId);
      const {options} = await this.stepFindAvaliableDateFlow.execute(accountId);

      result.options = options;

      if (appointment !== AppointmentResultEnum.NEW_APPOINTMENT) {
        const {startedDate} = appointment;
        const day = PadStartDateHelper(moment(startedDate).date(), 2);
        const month = PadStartDateHelper(moment(startedDate).month() + 1, 2);
        const year = moment(startedDate).year();

        const startedAppointmentHours = PadStartDateHelper(
          moment(startedDate).clone().hours(),
          2,
        );

        const startedAppointmentMinutes = PadStartDateHelper(
          moment(startedDate).clone().minutes(),
          2,
        );

        let date = `${day}/${month}`;

        if (ValidateIfIsDezemberHelper()) {
          date += `/${year}`;
        }

        const time = `${startedAppointmentHours}:${startedAppointmentMinutes}`;

        result.step = this.stepCompleted;
        result.response = FlowContext.successfulAppointmentMessage(date, time);
      } else {
        result.step = this.stepDateAppointment;
        result.response = RETRY_NEW_APPOINTMENT();
      }

      return result;
    } catch (error) {
      console.log(error);
      return result;
    }
  }
}
