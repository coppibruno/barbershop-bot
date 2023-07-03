import {Moment} from 'moment';
import {Meetings} from '@prisma/client';
import {faker} from '@faker-js/faker';

import {
  FindConversationsServiceStub,
  GetProtocolByPhoneConversationStub,
  GetUserNameConversationStub,
  MeetingRepositoryStub,
  SendMessageWhatsappServiceStub,
  fakeConversation,
  fakeMeeting,
} from '@/__mocks__';

import {StepFindAvaliableDateFlowStub} from './step-04-find-avaliable-date-service.mock';

import {StepGetDateAndReplyAppointmentFlow} from '@/services/flow/step-05-get-date-appointment-and-reply.service';

import {MeetingEntity} from '@/entity';

import {IFlowResult} from '@/interfaces';
import {FlowContext} from '@/flow.context';

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
  constructor(
    private readonly findConversationServiceStub: FindConversationsServiceStub,
    private readonly stepFindAvaliableDateFlowStub: StepFindAvaliableDateFlowStub,
    private readonly meetingRepositoryStub: MeetingRepositoryStub,
    private readonly getUserNameConversationStub: GetUserNameConversationStub,
    private readonly sendMessageWhatsappServiceStub: SendMessageWhatsappServiceStub,
    private readonly getProtocolByPhoneConversationStub: GetProtocolByPhoneConversationStub,
  ) {
    super(
      findConversationServiceStub,
      stepFindAvaliableDateFlowStub,
      meetingRepositoryStub,
      getUserNameConversationStub,
      sendMessageWhatsappServiceStub,
      getProtocolByPhoneConversationStub,
    );
  }

  /**
   * Envia uma mensagem para o admin com detalhes do novo agendamento
   * @param meeting Meeting (agendamento)
   */
  sendMessageToAdminWithNewAppointment(meeting: Meetings): void {
    const {name, phone, startDate} = meeting;

    const conversation = fakeConversation({
      name,
      toPhone: FlowContext.ADMIN_NUMBER,
      fromPhone: Number(FlowContext.BOT_NUMBER),
      body: 'any body notification',
    });

    this.sendMessageWhatsappServiceStub.execute(conversation);
  }

  async findMeetingIsAvaliable({startDate, endDate, phone}): Promise<Meetings> {
    return Promise.resolve(null);
  }

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
    phone: number,
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
  async saveAppointment(phone: number, appointment: string): Promise<Meetings> {
    return Promise.resolve(fakeMeeting());
  }

  async findAppointmentSelected(
    phone: number,
  ): Promise<{option: number; options: any}> {
    return Promise.resolve({
      option: 1,
      options: {1: '09:00', 2: '10:00'},
    });
  }
  /**
   *
   * @param accountId account id string
   * @returns
   */
  async getAppointmentMarked(phone: number): Promise<IExtractAppointment> {
    return {
      startedDate: mockedTime,
    };
  }

  async execute(phone: number): Promise<IFlowResult> {
    return Promise.resolve({
      response: 'message_step_5',
      step: 5,
    });
  }
}
