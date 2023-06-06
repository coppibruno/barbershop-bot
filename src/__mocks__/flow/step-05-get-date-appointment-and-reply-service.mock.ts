import {Moment} from 'moment';
import {Conversations, Meetings} from '@prisma/client';
import {faker} from '@faker-js/faker';

import {
  FindConversationsServiceStub,
  GetPhoneByAccountStub,
  GetUserNameConversationStub,
  MeetingRepositoryStub,
  fakeConversation,
  fakeMeeting,
} from '@/__mocks__';

import {StepFindAvaliableDateFlowStub} from './step-04-find-avaliable-date-service.mock';

import {StepGetDateAndReplyAppointmentFlow} from '@/services/flow/step-05-get-date-appointment-and-reply.service';

import {MeetingEntity} from '@/entity';

import {IFlowResult} from '@/interfaces';

interface AppointmentDate {
  startedDate: Date;
}

enum AppointmentResultEnum {
  NEW_APPOINTMENT = 'NEW_APPOINTMENT',
}

type IExtractAppointment =
  | AppointmentDate
  | AppointmentResultEnum.NEW_APPOINTMENT;
interface IOptions {
  option: number;
  appointment: string;
}

const mockedTime = faker.date.future();

/**
 * Etapa responsável por buscar horário selecionado, validar e retornar mensagem de sucesso caso seja.
 */
export class StepGetDateAndReplyAppointmentFlowStub extends StepGetDateAndReplyAppointmentFlow {
  private readonly findConversationServiceStub: FindConversationsServiceStub;
  private readonly stepFindAvaliableDateFlowStub: StepFindAvaliableDateFlowStub;
  private readonly meetingRepositoryStub: MeetingRepositoryStub;
  private readonly getUserNameConversationStub: GetUserNameConversationStub;
  private readonly getPhoneByAccountIdConversationStub: GetPhoneByAccountStub;

  constructor(
    findConversationServiceStub: FindConversationsServiceStub,
    stepFindAvaliableDateFlowStub: StepFindAvaliableDateFlowStub,
    meetingRepositoryStub: MeetingRepositoryStub,
    getUserNameConversationStub: GetUserNameConversationStub,
    getPhoneByAccountIdConversationStub: GetPhoneByAccountStub,
  ) {
    super(
      findConversationServiceStub,
      stepFindAvaliableDateFlowStub,
      meetingRepositoryStub,
      getUserNameConversationStub,
      getPhoneByAccountIdConversationStub,
    );
  }

  findMeetingIsAvaliable = async ({startDate, endDate, phone}) => {
    return [fakeMeeting()];
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
    return `10:00 - 11:00`;
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
    return Promise.resolve(fakeMeeting());
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
    return Promise.resolve(fakeMeeting());
  }

  /**
   *
   * @param options array de opções. Ex: ['09:00', '10:00', '11:00', ...]
   * @returns Array formatado com propriedades de Option e Appointment. Ex: [{option: 1, appointment: '09:00'}, ...]
   */
  extractAppointmentList(options: any): IOptions[] {
    return [
      {appointment: '9:00', option: 1},
      {appointment: '10:00', option: 2},
      {appointment: '11:00', option: 3},
    ];
  }

  async findAppointmentSelected(accountId: string): Promise<Conversations> {
    return fakeConversation();
  }
  /**
   *
   * @param accountId account id string
   * @returns
   */
  async getAppointmentMarked(accountId: string): Promise<IExtractAppointment> {
    return {
      startedDate: mockedTime,
    };
  }

  async execute(accountId: string): Promise<IFlowResult> {
    return Promise.resolve({
      response: 'message_step_5',
      step: 5,
    });
  }
}
