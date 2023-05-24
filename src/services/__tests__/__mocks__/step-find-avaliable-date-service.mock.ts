import {Meetings} from '@prisma/client';
import {Moment} from 'moment';
import {IAppointmentsResult, IFlowResult} from '../../../interfaces';
import {StepFindAvaliableDateFlow} from '../../flow';
import {FindConversationsServiceStub} from './find-conversation-service.mock';
import {FindMeetingsOfDayServiceStub} from './find-meetings-of-day-service.mock';
import {faker} from '@faker-js/faker';
import {FindConversationsService} from '../../find-conversation.service';
import {FindMeetingsOfDayService} from '../../find-meetings-of-day.service';

interface IOptionsAppointment {
  options: string[];
  response: string;
}

const mockedTime = faker.date.future();

export class StepFindAvaliableDateServiceStub
  implements StepFindAvaliableDateFlow
{
  constructor(
    public readonly findConversationService: FindConversationsServiceStub,
    public readonly findMeetingsOfDayService: FindMeetingsOfDayServiceStub,
  ) {}
  public stepCompleted: number;
  public incompleteStep: number;
  public startAppointmentDay: string;
  public endAppointmentDay: string;
  public startSaturdayAppointmentDay: string;
  public endSaturdayAppointmentDay: string;
  public startLunchTimeOff: string | boolean;
  public endLunchTimeOff: string | boolean;
  public readonly appointmentTimeInMinutes: string;

  appointmentAlreadyUsed(
    meetsOfDay: any,
    startAppointment: any,
    endAppointment: any,
  ) {
    return true;
  }
  isOnLunchBreak({
    appointment,
    lunchStart,
    lunchEnd,
  }: {
    appointment: any;
    lunchStart: any;
    lunchEnd: any;
  }): boolean {
    return true;
  }
  getMaxAndMinAppointmentFromDay(date: Moment): {
    startDate: Moment;
    endDate: Moment;
  } {
    return {startDate: mockedTime as any, endDate: mockedTime as any};
  }
  verifyIfAppointmentIsAvaliable(
    meetsOfDay: Meetings[],
    startAppointment: Moment,
    endAppointment: Moment,
  ): boolean {
    return true;
  }
  validateIfAppointmentIsLunchTime(appointment: Moment): boolean {
    return true;
  }
  getAppointmentsOfDate(dayMonth: string): Promise<IAppointmentsResult[]> {
    return Promise.resolve([
      {
        option: 1,
        description: '09h',
      },
      {
        option: 2,
        description: '10h',
      },
    ]);
  }
  findAvaliableTime(dayMonth: string): Promise<IOptionsAppointment> {
    return Promise.resolve({
      options: ['09', '10', '11'],
      response: 'data mocked',
    });
  }
  getDateAppointment(accountId: string): Promise<string> {
    return Promise.resolve('true');
  }
  execute(accountId: string): Promise<IFlowResult> {
    return Promise.resolve({
      response: 'mocked data flow',
      step: 4,
    });
  }
}
