import * as Step from '../step-04-find-avaliable-date.service';
import {
  FindConversationsServiceStub,
  ConversationRepositoryStub,
  fakeConversation,
  FindMeetingsOfDayServiceStub,
  MeetingRepositoryStub,
  fakeMeeting,
  StepResponseByOptionMenuFlowStub,
} from '@/__mocks__';
import {faker} from '@faker-js/faker';
import * as IsValid from '../../../helpers/validate-appoitment.helper';
import * as DateHelper from '../../../helpers/transform-appointment-in-date.helper';
import * as StartEndLunchTime from '../../../helpers/fetch-start-and-end-lunch-time.helper';
import * as FetchMaxMin from '../../../helpers/fetch-max-and-min-appointment-from-day.helper';
import {InvalidDataIsProvidedError} from '@/errors';

const fakeAppointmentResult = (time, option) => ({
  description: time,
  option,
});

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const meetingRepositoryStub = new MeetingRepositoryStub();
  const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
    meetingRepositoryStub,
  );

  const stepResponseByOptionMenuFlowStub = new StepResponseByOptionMenuFlowStub(
    findConversationsServiceStub,
  );

  const sut = new Step.StepFindAvaliableDateFlow(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
    stepResponseByOptionMenuFlowStub,
  );

  return {
    sut,
    meetingRepositoryStub,
    findMeetingsOfDayServiceStub,
    findConversationsServiceStub,
    conversationRepositoryStub,
  };
};

const mockedTime = faker.date.future();
const day = mockedTime.getDate();
const month = mockedTime.getMonth() + 1;

const dayMonth = `${day}/${month}`;
const {findConversationsServiceStub} = makeSut();

jest.spyOn(Step, 'getClone').mockImplementation(() => mockedTime);
jest.spyOn(Step, 'getDay').mockImplementation(() => mockedTime.getDate());
jest
  .spyOn(Step, 'getMonth')
  .mockImplementation(() => mockedTime.getMonth() + 1);
jest.spyOn(Step, 'getHours').mockImplementation(() => mockedTime.getHours());
jest.spyOn(Step, 'getMins').mockImplementation(() => mockedTime.getMinutes());
jest.spyOn(Step, 'addDate').mockImplementation(() => mockedTime);
jest.spyOn(Step, 'setDay').mockImplementation(() => mockedTime);
jest.spyOn(Step, 'setHours').mockImplementation(() => mockedTime);
jest.spyOn(Step, 'setMonth').mockImplementation(() => mockedTime);
jest.spyOn(Step, 'setMinutes').mockImplementation(() => mockedTime);
jest.spyOn(Step, 'setSeconds').mockImplementation(() => mockedTime);
jest.spyOn(Step, 'isAfter').mockImplementation(() => true);
jest.spyOn(Step, 'isSaturday').mockImplementation(() => false);
jest.spyOn(Step, 'isSameDate').mockImplementation(() => false);
jest.spyOn(IsValid, 'AppointmentIsValidHelper').mockReturnValueOnce(true);
jest
  .spyOn(DateHelper, 'TransformAppointmentInDateHelper')
  .mockReturnValueOnce(mockedTime as any);
jest
  .spyOn(findConversationsServiceStub, 'findOne')
  .mockImplementationOnce(() =>
    Promise.resolve(fakeConversation({body: dayMonth})),
  );
jest
  .spyOn(StartEndLunchTime, 'FetchStartAndEndLunchTimeHelper')
  .mockImplementation(() => ({
    start: mockedTime as any,
    end: mockedTime as any,
  }));
jest
  .spyOn(FetchMaxMin, 'FetchMaxAndMinAppointmentFromDay')
  .mockImplementation(() => ({
    startDate: mockedTime as any,
    endDate: mockedTime as any,
  }));

describe('StepFindAvaliableAppointment', () => {
  test('should return a list of appointment from day and step 4 on success', async () => {
    const {sut} = makeSut();
    const accountId = 'fake_account_id';
    jest
      .spyOn(sut, 'getAppointmentsOfDate')
      .mockImplementationOnce(() =>
        Promise.resolve([
          fakeAppointmentResult('09:00', 1),
          fakeAppointmentResult('10:00', 2),
          fakeAppointmentResult('11:00', 3),
          fakeAppointmentResult('12:00', 4),
        ]),
      );
    const result = await sut.execute(accountId);

    expect(result.response).toEqual(
      expect.stringMatching(/temos esses horários disponiveis/i),
    );
    expect(result.step).toBe(sut.stepCompleted); //step 4
  });
  test('should return a message that from the day there is no time available', async () => {
    const accountId = 'any_value';
    const {sut} = makeSut();
    //mock empty avaliable appointments
    jest
      .spyOn(sut, 'getAppointmentsOfDate')
      .mockImplementation(() => Promise.resolve([]));
    const result = await sut.execute(accountId);
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.response).toEqual(
      expect.stringMatching(/não temos horários disponiveis/i),
    );
    expect(result.step).toBe(sut.stepCompleted); //step 4
  });
  test('should return message that day is sunday to retry again', async () => {
    const {sut} = makeSut();
    const accountId = 'fake_account_id';

    jest
      .spyOn(sut, 'getDateAppointment')
      .mockImplementationOnce(() =>
        Promise.reject(new InvalidDataIsProvidedError(Step.INVALID_SUNDAY())),
      );
    const result = await sut.execute(accountId);

    expect(result.response).toBe(Step.INVALID_SUNDAY());
    expect(result.step).toBe(3);
  });
  test('should return message that day is monday to retry again', async () => {
    const {sut} = makeSut();
    const accountId = 'fake_account_id';

    jest
      .spyOn(sut, 'getDateAppointment')
      .mockImplementationOnce(() =>
        Promise.reject(new InvalidDataIsProvidedError(Step.INVALID_MONDAY())),
      );
    const result = await sut.execute(accountId);

    expect(result.response).toBe(Step.INVALID_MONDAY());
    expect(result.step).toBe(3);
  });
  test('should return message that day is invalid date and to retry again', async () => {
    const {sut} = makeSut();
    const accountId = 'fake_account_id';

    jest
      .spyOn(sut, 'getDateAppointment')
      .mockImplementationOnce(() =>
        Promise.reject(new InvalidDataIsProvidedError(Step.INVALID_DATE())),
      );
    const result = await sut.execute(accountId);

    expect(result.response).toBe(Step.INVALID_DATE());
    expect(result.step).toBe(3);
  });
});

describe('GetAppointmentsOfDate', () => {
  test('should return a list of appointment from getAppointmentsOfDate', async () => {
    const {sut} = makeSut();

    jest
      .spyOn(sut, 'validateIfAppointmentIsLunchTime')
      .mockImplementation(() => false);

    jest
      .spyOn(sut, 'verifyIfAppointmentIsAvaliable')
      .mockImplementation(() => true);

    jest
      .spyOn(Step, 'isSameDate')
      .mockImplementation(() => false)
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true); //mock true after third call

    const result = await sut.getAppointmentsOfDate(dayMonth);

    expect(result.length).toBeGreaterThan(0);

    result.forEach((item) => {
      expect(item).toHaveProperty('option');
      expect(item).toHaveProperty('description');
    });
  });
});

describe('validateIfAppointmentIsLunchTime', () => {
  test('should return true if time is lunch time', () => {
    const {sut} = makeSut();

    jest.replaceProperty(sut, 'startLunchTimeOff', '12:00');
    jest.replaceProperty(sut, 'endLunchTimeOff', '13:00');

    jest.spyOn(sut, 'dateIsLunchTime').mockImplementation(() => true);

    const result = sut.validateIfAppointmentIsLunchTime(mockedTime as any);

    expect(result).toBe(true);
  });
  test('should return false if not set lunch time', () => {
    const {sut} = makeSut();

    jest.replaceProperty(sut, 'startLunchTimeOff', undefined);
    jest.replaceProperty(sut, 'endLunchTimeOff', undefined);

    const result = sut.validateIfAppointmentIsLunchTime(mockedTime as any);

    expect(result).toBe(false);
  });
  test('should return false if time not is lunch time', () => {
    const {sut} = makeSut();

    jest.replaceProperty(sut, 'startLunchTimeOff', '12:00');
    jest.replaceProperty(sut, 'endLunchTimeOff', '13:00');

    jest.spyOn(sut, 'dateIsLunchTime').mockImplementation(() => false);

    const result = sut.validateIfAppointmentIsLunchTime(mockedTime as any);

    expect(result).toBe(false);
  });
});

describe('verifyIfAppointmentIsAvaliable', () => {
  test('should return true if appointment is avaliable', () => {
    const {sut} = makeSut();

    jest.replaceProperty(sut, 'disableAppointments', [fakeMeeting()]);

    jest
      .spyOn(sut, 'appointmentAlreadyUsed')
      .mockImplementation(() => undefined);

    const result = sut.verifyIfAppointmentIsAvaliable(
      mockedTime as any,
      mockedTime as any,
    );

    expect(result).toBe(true);
  });
  test('should return true if there no disable appointments on the day', () => {
    const {sut} = makeSut();

    jest.replaceProperty(sut, 'disableAppointments', []);

    const result = sut.verifyIfAppointmentIsAvaliable(
      mockedTime as any,
      mockedTime as any,
    );

    expect(result).toBe(true);
  });
  test('should return false if already filled appointment ', () => {
    const {sut} = makeSut();

    jest.replaceProperty(sut, 'disableAppointments', [fakeMeeting()]);

    jest
      .spyOn(sut, 'appointmentAlreadyUsed')
      .mockImplementation(() => fakeMeeting());

    const result = sut.verifyIfAppointmentIsAvaliable(
      mockedTime as any,
      mockedTime as any,
    );

    expect(result).toBe(false);
  });
});
