import * as Step from '../step-04-find-avaliable-date.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  fakeConversation,
  FindMeetingsOfDayServiceStub,
  MeetingRepositoryStub,
  fakeMeeting,
} from '@/__mocks__';
import {faker} from '@faker-js/faker';
import * as IsValid from '../../../helpers/validate-appoitment.helper';
import {IAppointmentsResult} from '../../../interfaces/flow';
import * as DateHelper from '../../../helpers/transform-appointment-in-date.helper';
import * as StartEndLunchTime from '../../../helpers/fetch-start-and-end-lunch-time.helper';

const fakeAppointmentResult: IAppointmentsResult = {
  description: '09:00 - 10:00',
  option: 1,
};

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const meetingRepositoryStub = new MeetingRepositoryStub();
  const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
    meetingRepositoryStub,
  );

  const sut = new Step.StepFindAvaliableDateFlow(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
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

describe('StepFindAvaliableAppointment', () => {
  test('should return a list of appointment from day and step 4 on success', async () => {
    const {sut} = makeSut();
    const accountId = 'fake_account_id';

    jest
      .spyOn(sut, 'getAppointmentsOfDate')
      .mockImplementationOnce(() =>
        Promise.resolve([fakeAppointmentResult, fakeAppointmentResult]),
      );

    jest
      .spyOn(Step, 'isSameDate')
      .mockImplementation(() => false)
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true); //mock true after third call

    const result = await sut.execute(accountId);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.response).toEqual(
      expect.stringMatching(/temos esses horários disponiveis/i),
    );
    expect(result.step).toBe(sut.stepCompleted); //step 4
  });

  test('should return a message that from the day there is no time available', async () => {
    const accountId = 'any_value';
    const {sut} = makeSut();

    jest
      .spyOn(sut, 'verifyIfAppointmentIsAvaliable')
      .mockImplementation(() => false);

    const result = await sut.execute(accountId);
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.response).toEqual(
      expect.stringMatching(/não temos horários disponiveis/i),
    );
    expect(result.step).toBe(sut.stepCompleted); //step 4
  });
});

describe('GetAppointmentsOfDate', () => {
  test('should return a list of appointment from getAppointmentsOfDate', async () => {
    const {sut} = makeSut();
    jest
      .spyOn(sut, 'getMaxAndMinAppointmentFromDay')
      .mockImplementation(() => ({
        startDate: mockedTime as any,
        endDate: mockedTime as any,
      }));

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

    expect(result).toStrictEqual(expect.any(Array));
  });
});

describe('GetMaxAndMinAppointmentFromDay', () => {
  test('should return a min and max date from appointment day', () => {
    const {sut} = makeSut();
    jest.clearAllMocks();
    //weekday
    jest.replaceProperty(sut, 'startAppointmentDay', '09:00');
    jest.replaceProperty(sut, 'endAppointmentDay', '21:00');

    const result = sut.getMaxAndMinAppointmentFromDay(mockedTime as any);

    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');

    // expect(Step.setHours).toHaveBeenCalledTimes(2);
    expect(Step.setHours).toHaveBeenNthCalledWith(1, mockedTime, 9);
    expect(Step.setHours).toHaveBeenNthCalledWith(2, mockedTime, 21);

    expect(Step.setMinutes).toHaveBeenNthCalledWith(1, mockedTime, 0);
    expect(Step.setMinutes).toHaveBeenNthCalledWith(2, mockedTime, 0);

    expect(Step.setSeconds).toHaveBeenNthCalledWith(1, mockedTime, 0);
    expect(Step.setSeconds).toHaveBeenNthCalledWith(2, mockedTime, 0);
  });
  test('should return short list if is sunday', () => {
    const {sut} = makeSut();
    jest.clearAllMocks();

    //weekday
    jest.replaceProperty(sut, 'startAppointmentDay', '09:00');
    jest.replaceProperty(sut, 'endAppointmentDay', '21:00');

    //mock saturday true for this case
    jest.spyOn(Step, 'isSaturday').mockImplementation(() => true);

    //sunday hours
    jest.replaceProperty(sut, 'startSaturdayAppointmentDay', '09:00');
    jest.replaceProperty(sut, 'endSaturdayAppointmentDay', '12:00');

    const result = sut.getMaxAndMinAppointmentFromDay(mockedTime as any);

    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');

    expect(Step.setHours).toHaveBeenNthCalledWith(1, mockedTime, 9);
    expect(Step.setHours).toHaveBeenNthCalledWith(2, mockedTime, 12);

    expect(Step.setMinutes).toHaveBeenNthCalledWith(1, mockedTime, 0);
    expect(Step.setMinutes).toHaveBeenNthCalledWith(2, mockedTime, 0);

    expect(Step.setSeconds).toHaveBeenNthCalledWith(1, mockedTime, 0);
    expect(Step.setSeconds).toHaveBeenNthCalledWith(2, mockedTime, 0);
  });
});

describe('validateIfAppointmentIsLunchTime', () => {
  test('should return true if time is lunch time', () => {
    const {sut} = makeSut();

    jest.replaceProperty(sut, 'startLunchTimeOff', '12:00');
    jest.replaceProperty(sut, 'endLunchTimeOff', '13:00');

    jest.spyOn(sut, 'isOnLunchBreak').mockImplementation(() => true);

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

    jest.spyOn(sut, 'isOnLunchBreak').mockImplementation(() => false);

    const result = sut.validateIfAppointmentIsLunchTime(mockedTime as any);

    expect(result).toBe(false);
  });
});

describe('verifyIfAppointmentIsAvaliable', () => {
  test('should return true if appointment is avaliable', () => {
    const {sut} = makeSut();

    jest.spyOn(sut, 'appointmentAlreadyUsed').mockImplementation(() => false);

    const result = sut.verifyIfAppointmentIsAvaliable(
      [fakeMeeting(), fakeMeeting(), fakeMeeting()],
      mockedTime as any,
      mockedTime as any,
    );

    expect(result).toBe(true);
  });
  test('should return true if there no appointments on the day', () => {
    const {sut} = makeSut();

    const result = sut.verifyIfAppointmentIsAvaliable(
      [], //empty list meet on the day
      mockedTime as any,
      mockedTime as any,
    );

    expect(result).toBe(true);
  });
  test('should return false if already filled appointment ', () => {
    const {sut} = makeSut();

    jest.spyOn(sut, 'appointmentAlreadyUsed').mockImplementation(() => true);

    const result = sut.verifyIfAppointmentIsAvaliable(
      [fakeMeeting(), fakeMeeting(), fakeMeeting()],
      mockedTime as any,
      mockedTime as any,
    );

    expect(result).toBe(false);
  });
});
