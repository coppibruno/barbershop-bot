import {
  DefaultError,
  InvalidDateError,
  RetryNewAppointmentDate,
} from '../../errors';
import {InvalidMenuOptionError} from '../../errors/invalid-menu-option.enum';
import {FlowContext} from '../../flow.context';
import {IFlowResult} from '../../interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';
import moment from 'moment';
import {StepFindAvaliableDateFlow} from './step-04-find-avaliable-date.service';
import {Conversations, Meetings} from '@prisma/client';
import {MeetingRepository} from '../../repositories/meeting.repository';
import {MeetingEntity} from '../../entity/meeting.entity';
import {FetchStartAndEndAppointmentTimeHelper} from '../../helpers/fetch-start-and-end-appointment-time.helper';
import {ValidateIfIsDezemberHelper} from '../../helpers/validate-if-is-dezember.helper';
import {PadStartDateHelper} from '../../helpers/pad-start.helper';
import {isDezember} from '../../helpers/validate-appoitment.helper';
interface AppointmentDate {
  startedDate: Date;
}

type IExtractAppointment =
  | AppointmentDate
  | RetryNewAppointmentDate.MAKE_APPOINTMENT
  | RetryNewAppointmentDate.MAKE_APPOINTMENT_DEZEMBER
  | InvalidMenuOptionError.INVALID_MENU_OPTION
  | DefaultError.TRY_AGAIN;
interface IOptions {
  option: number;
  appointment: string;
}

export const RETRY_NEW_APPOINTMENT = () =>
  isDezember()
    ? RetryNewAppointmentDate.MAKE_APPOINTMENT_DEZEMBER
    : RetryNewAppointmentDate.MAKE_APPOINTMENT;

export const INVALID_DATE = () =>
  isDezember()
    ? InvalidDateError.INVALID_DATE_DEZEMBER
    : InvalidDateError.INVALID_DATE;

/**
 * Etapa responsável por buscar horário selecionado, validar e retornar mensagem de sucesso caso seja.
 */
export class StepGetDateAndReplyAppointmentFlow {
  private readonly findConversationService: FindConversationsService;
  private readonly stepFindAvaliableDateFlow: StepFindAvaliableDateFlow;
  private readonly meetingRepository: MeetingRepository;
  private readonly stepCompleted: number = 5;
  private readonly incompleteStep: number = 4;
  private readonly stepDateAppointment: number = 3;

  constructor(
    findConversationService: FindConversationsService,
    stepFindAvaliableDateFlow: StepFindAvaliableDateFlow,
    meetingRepository: MeetingRepository,
  ) {
    this.findConversationService = findConversationService;
    this.stepFindAvaliableDateFlow = stepFindAvaliableDateFlow;
    this.meetingRepository = meetingRepository;
  }

  async getDataToNewMeet(
    accountId: string,
    appointmentTime: string,
  ): Promise<DefaultError.TRY_AGAIN | MeetingEntity> {
    const history = await this.findConversationService.find({
      where: {accountId: accountId},
    });

    const stepDayAppointment = history.find(
      (item) =>
        item.step === 3 && item.toPhone === Number(FlowContext.BOT_NUMBER),
    );
    if (!stepDayAppointment) {
      return DefaultError.TRY_AGAIN;
    }

    const dayMonth = stepDayAppointment.body;
    const objStartDateEndDate = FetchStartAndEndAppointmentTimeHelper(
      dayMonth,
      appointmentTime,
    );

    if (
      objStartDateEndDate === InvalidDateError.INVALID_DATE ||
      objStartDateEndDate === InvalidDateError.INVALID_DATE_DEZEMBER
    ) {
      return DefaultError.TRY_AGAIN;
    }

    const {startDate, endDate} = objStartDateEndDate;

    const meetingEntity: MeetingEntity = {
      name: stepDayAppointment.name,
      phone: stepDayAppointment.fromPhone,
      startDate: startDate,
      endDate: endDate,
    };
    return meetingEntity;
  }

  async saveAppointment(
    accountId: string,
    appointment: string,
  ): Promise<Meetings | DefaultError.TRY_AGAIN> {
    const meetingEntity = await this.getDataToNewMeet(accountId, appointment);
    if (meetingEntity === DefaultError.TRY_AGAIN) {
      return DefaultError.TRY_AGAIN;
    }
    return this.meetingRepository.create(meetingEntity);
  }

  extractAppointmentList(options: any): IOptions[] {
    const list = Object.keys(options).map(Number);
    const appointments = Object.values(options).map(String);
    return list.map((option) => ({
      option,
      appointment: appointments[option - 1],
    }));
  }

  async findAppointmentSelected(accountId: string): Promise<Conversations> {
    const appointmentSelected = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        step: 4,
        toPhone: Number(FlowContext.BOT_NUMBER),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!appointmentSelected) {
      throw new Error('find appointment selected failed');
    }

    return appointmentSelected;
  }

  async extractAppointmentSelected(
    accountId: string,
  ): Promise<IExtractAppointment> {
    const {body: appointmentSelected, options} =
      await this.findAppointmentSelected(accountId);

    if (appointmentSelected) {
      let formattedOption: number;

      try {
        formattedOption = Number(appointmentSelected);
      } catch (e: any) {
        console.error(e.message);
        return InvalidMenuOptionError.INVALID_MENU_OPTION;
      }

      if (formattedOption === FlowContext.OPTION_RETRY_DATE_APPOINTMENT) {
        return RETRY_NEW_APPOINTMENT();
      }

      const menuOptions = this.extractAppointmentList(options);

      const optionExistsInArray = menuOptions.find(
        (i) => i.option === formattedOption,
      );

      if (!optionExistsInArray) {
        return InvalidMenuOptionError.INVALID_MENU_OPTION;
      }

      const appointmentTime = optionExistsInArray.appointment;

      //ToDo: Verificar se o horario não está agendando antes de marcar
      const meetSaved = await this.saveAppointment(accountId, appointmentTime);

      if (meetSaved === DefaultError.TRY_AGAIN) {
        return DefaultError.TRY_AGAIN;
      }

      return {
        startedDate: meetSaved.startDate,
      };
    }
    return DefaultError.TRY_AGAIN;
  }

  async execute(accountId: string): Promise<IFlowResult> {
    const appointment = await this.extractAppointmentSelected(accountId);
    const {options} = await this.stepFindAvaliableDateFlow.execute(accountId);

    const result: IFlowResult = {
      response: '',
      step: this.incompleteStep,
      options,
    };

    if (appointment === DefaultError.TRY_AGAIN) {
      result.step = this.incompleteStep;
      result.response = DefaultError.TRY_AGAIN;
    } else if (appointment === InvalidMenuOptionError.INVALID_MENU_OPTION) {
      result.step = this.incompleteStep;
      result.response = InvalidMenuOptionError.INVALID_MENU_OPTION;
    } else if (
      appointment === RetryNewAppointmentDate.MAKE_APPOINTMENT ||
      appointment === RetryNewAppointmentDate.MAKE_APPOINTMENT_DEZEMBER
    ) {
      result.step = this.stepDateAppointment;
      result.response = appointment;
    } else {
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
    }

    return result;
  }
}
