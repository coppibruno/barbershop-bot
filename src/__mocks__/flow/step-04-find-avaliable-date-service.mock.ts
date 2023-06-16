import {faker} from '@faker-js/faker';
import {Moment} from 'moment';

import {IAppointmentsResult, IFlowResult} from '@/interfaces/flow';
import {Meetings} from '@prisma/client';
import {
  FindConversationsServiceStub,
  FindMeetingsOfDayServiceStub,
  StepResponseByOptionMenuFlowStub,
} from '@/__mocks__';

import {StepFindAvaliableDateFlow} from '@/services/flow/step-04-find-avaliable-date.service';

interface IOptionsAppointment {
  options: string[];
  response: string;
}

const mockedTime = faker.date.future();

/**
 * Etapa responsável por buscar horários disponiveis no dia escolhido pelo usuário
 */
export class StepFindAvaliableDateFlowStub extends StepFindAvaliableDateFlow {
  constructor(
    findConversationServiceStub: FindConversationsServiceStub,
    findMeetingsOfDayServiceStubStub: FindMeetingsOfDayServiceStub,
    stepResponseByOptionMenuFlowStub: StepResponseByOptionMenuFlowStub,
  ) {
    super(
      findConversationServiceStub,
      findMeetingsOfDayServiceStubStub,
      stepResponseByOptionMenuFlowStub,
    );
  }

  public appointmentAlreadyUsed(
    startAppointment: Moment,
    endAppointment: Moment,
  ): Meetings {
    return undefined;
  }

  public isOnLunchBreak({appointment, lunchStart, lunchEnd}) {
    return false;
  }

  public getMaxAndMinAppointmentFromDay(date: Moment): {
    startDate: Moment;
    endDate: Moment;
  } {
    return {startDate: mockedTime as any, endDate: mockedTime as any};
  }

  public verifyIfAppointmentIsAvaliable(
    startAppointment: Moment,
    endAppointment: Moment,
  ) {
    return true;
  }

  public validateIfAppointmentIsLunchTime(appointment: Moment): boolean {
    return false;
  }

  public async getAppointmentsOfDate(
    dayMonth: string,
  ): Promise<IAppointmentsResult[]> {
    return [
      {
        description: 'any_desc1',
        option: 1,
      },
      {
        description: 'any_desc2',
        option: 2,
      },
      {
        description: 'any_desc3',
        option: 3,
      },
    ];
  }

  public async findAvaliableTime(
    dayMonth: string,
  ): Promise<IOptionsAppointment> {
    return {options: [], response: 'any_response'};
  }

  public async getDateAppointment(accountId: string): Promise<string> {
    return '10/10';
  }

  async execute(accountId: string): Promise<IFlowResult> {
    return Promise.resolve({
      response: 'message_step_4',
      step: 4,
    });
  }
}
