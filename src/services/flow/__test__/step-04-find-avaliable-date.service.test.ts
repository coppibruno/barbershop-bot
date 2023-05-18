import * as Step from '../step-04-find-avaliable-date.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  fakeConversation,
  FindMeetingsOfDayServiceStub,
  MeetingRepositoryStub,
} from '../../__tests__/__mocks__/';
import {faker} from '@faker-js/faker';
import * as IsValid from '../../../helpers/validate-appoitment.helper';
import {IAppointmentsResult} from '../../../interfaces/flow';
import {FlowContext} from '../../../flow.context';
import * as DateHelper from '../../../helpers/transform-appointment-in-date.helper';
import {InvalidDateError} from '../../../errors';

const fakeAppointmentResult: IAppointmentsResult = {
  description: '09:00 - 10:00',
  option: 1,
};

describe('Step Find Avaliable Appointment', () => {
  test('should return a list of appointment from day and step 4 on success', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();
    const findConversationsServiceStub = new FindConversationsServiceStub(
      conversationRepositoryStub,
    );

    const meetingRepositoryStub = new MeetingRepositoryStub();
    const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
      meetingRepositoryStub,
    );

    const accountId = 'any_value';
    const exec = new Step.StepFindAvaliableDateFlow(
      findConversationsServiceStub,
      findMeetingsOfDayServiceStub,
    );

    const mockedTime = faker.date.future();
    const day = mockedTime.getDate();
    const month = mockedTime.getMonth() + 1;

    const dayMonth = `${day}/${month}`;

    jest.spyOn(IsValid, 'AppointmentIsValidHelper').mockReturnValueOnce(true);
    jest
      .spyOn(exec, 'getAppointmentsOfDate')
      .mockImplementationOnce(() =>
        Promise.resolve([fakeAppointmentResult, fakeAppointmentResult]),
      );
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: dayMonth})),
      );

    const result = await exec.execute(accountId);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.response).toEqual(
      expect.stringMatching(/temos esses horários disponiveis/i),
    );
    expect(result.step).toBe(exec.stepCompleted); //step 4
  });
  test('should return a message that from the day there is no time available', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();
    const findConversationsServiceStub = new FindConversationsServiceStub(
      conversationRepositoryStub,
    );

    const meetingRepositoryStub = new MeetingRepositoryStub();
    const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
      meetingRepositoryStub,
    );

    const accountId = 'any_value';
    const exec = new Step.StepFindAvaliableDateFlow(
      findConversationsServiceStub,
      findMeetingsOfDayServiceStub,
    );

    const mockedTime = faker.date.future();
    const day = mockedTime.getDate();
    const month = mockedTime.getMonth() + 1;

    const dayMonth = `${day}/${month}`;

    jest.spyOn(IsValid, 'AppointmentIsValidHelper').mockReturnValueOnce(true);

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: dayMonth})),
      );

    jest
      .spyOn(exec, 'verifyIfAppointmentIsAvaliable')
      .mockImplementation(() => false);

    const result = await exec.execute(accountId);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.response).toEqual(
      expect.stringMatching(/não temos horários disponiveis/i),
    );

    expect(result.step).toBe(exec.stepCompleted); //step 4
  });
});

describe('get Appointments Of Date', () => {
  test('should return a list of appointment from getAppointmentsOfDate', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();
    const findConversationsServiceStub = new FindConversationsServiceStub(
      conversationRepositoryStub,
    );

    const meetingRepositoryStub = new MeetingRepositoryStub();
    const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
      meetingRepositoryStub,
    );

    const exec = new Step.StepFindAvaliableDateFlow(
      findConversationsServiceStub,
      findMeetingsOfDayServiceStub,
    );

    const mockedTime = faker.date.future();
    const day = mockedTime.getDate();
    const month = mockedTime.getMonth() + 1;

    const dayMonth = `${day}/${month}`;

    const result = await exec.getAppointmentsOfDate(dayMonth);

    expect(result).toStrictEqual(expect.any(Array));
  });
  test('should return a empty list if invalid date is provided', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();
    const findConversationsServiceStub = new FindConversationsServiceStub(
      conversationRepositoryStub,
    );

    const meetingRepositoryStub = new MeetingRepositoryStub();
    const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
      meetingRepositoryStub,
    );

    const exec = new Step.StepFindAvaliableDateFlow(
      findConversationsServiceStub,
      findMeetingsOfDayServiceStub,
    );

    const mockedTime = faker.date.future();
    const day = mockedTime.getDate();
    const month = mockedTime.getMonth() + 1;

    const dayMonth = `${day}/${month}`;

    jest
      .spyOn(DateHelper, 'TransformAppointmentInDateHelper')
      .mockReturnValueOnce(InvalidDateError.INVALID_DATE);

    const result = await exec.getAppointmentsOfDate(dayMonth);

    expect(result.length).toBe(0);
  });
  // ... adicionar mais testes para essa função
});

describe('get Max And Min Appointment From Day', () => {
  test('should return a min and max date from appointment day', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();
    const findConversationsServiceStub = new FindConversationsServiceStub(
      conversationRepositoryStub,
    );

    const meetingRepositoryStub = new MeetingRepositoryStub();
    const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
      meetingRepositoryStub,
    );

    const exec = new Step.StepFindAvaliableDateFlow(
      findConversationsServiceStub,
      findMeetingsOfDayServiceStub,
    );

    const mockedTime = faker.date.future();

    jest.replaceProperty(exec, 'startAppointmentDay', '09:00');
    jest.replaceProperty(exec, 'startAppointmentDay', '21:00');

    const result = await exec.getMaxAndMinAppointmentFromDay(mockedTime as any);

    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');

    expect(result.startDate).toBe(mockedTime.setHours(9, 0, 0));
    expect(result.endDate).toBe(mockedTime.setHours(21, 0, 0));
  });
  test('should return a empty list if invalid date is provided', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();
    const findConversationsServiceStub = new FindConversationsServiceStub(
      conversationRepositoryStub,
    );

    const meetingRepositoryStub = new MeetingRepositoryStub();
    const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
      meetingRepositoryStub,
    );

    const exec = new Step.StepFindAvaliableDateFlow(
      findConversationsServiceStub,
      findMeetingsOfDayServiceStub,
    );

    const mockedTime = faker.date.future();
    const day = mockedTime.getDate();
    const month = mockedTime.getMonth() + 1;

    const dayMonth = `${day}/${month}`;

    jest
      .spyOn(DateHelper, 'TransformAppointmentInDateHelper')
      .mockReturnValueOnce(InvalidDateError.INVALID_DATE);

    const result = await exec.getAppointmentsOfDate(dayMonth);

    expect(result.length).toBe(0);
  });
  // ... adicionar mais testes para essa função
});

/**
     * getStartAndEndDateFromAppointment
verifyIfAppointmentIsAvaliable
validateIfAppointmentIsLunchTime
getAppointmentsOfDate
findAvaliableTime
getDateAppointment
     * 
     */
