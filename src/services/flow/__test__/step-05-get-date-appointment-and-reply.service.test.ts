import * as Step from '../step-05-get-date-appointment-and-reply.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  FindMeetingsOfDayServiceStub,
  GetPhoneByAccountStub,
  GetUserNameConversationStub,
  MeetingRepositoryStub,
  StepFindAvaliableDateServiceStub,
  fakeConversation,
  fakeMeeting,
} from '@/__mocks__';
import {STEP_NOT_IMPLEMETED} from '../../../errors';
import {faker} from '@faker-js/faker';
import * as StartAndEndAppontiment from '../../../helpers/fetch-start-and-end-appointment-time.helper';

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();

  const meetingRepositoryStub = new MeetingRepositoryStub();

  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );
  const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
    meetingRepositoryStub,
  );
  const stepFindAvaliableDateFlowStub = new StepFindAvaliableDateServiceStub(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
  );

  const getUserNameConversationStub = new GetUserNameConversationStub(
    findConversationsServiceStub,
  );
  const getPhoneByAccountStub = new GetPhoneByAccountStub(
    findConversationsServiceStub,
  );

  const sut = new Step.StepGetDateAndReplyAppointmentFlow(
    findConversationsServiceStub,
    stepFindAvaliableDateFlowStub,
    meetingRepositoryStub,
    getUserNameConversationStub,
    getPhoneByAccountStub,
  );

  return {
    sut,
    findConversationsServiceStub,
    stepFindAvaliableDateFlowStub,
    meetingRepositoryStub,
  };
};

const mockedTime = faker.date.future();

jest.spyOn(Step, 'getClone').mockImplementation(() => mockedTime);
jest.spyOn(Step, 'getHours').mockImplementation(() => mockedTime.getHours());
jest.spyOn(Step, 'getMins').mockImplementation(() => mockedTime.getMinutes());
jest.spyOn(Step, 'addDate').mockImplementation(() => mockedTime);
jest.spyOn(Step, 'setHours').mockImplementation(() => mockedTime);
jest.spyOn(Step, 'setMinutes').mockImplementation(() => mockedTime);
jest.spyOn(Step, 'setSeconds').mockImplementation(() => mockedTime);

jest
  .spyOn(StartAndEndAppontiment, 'FetchStartAndEndAppointmentTimeHelper')
  .mockImplementationOnce(() => ({
    startDate: mockedTime as any,
    endDate: mockedTime as any,
  }));

describe('Step Get Date Appointment And Reply execute', () => {
  test('should return success message that appointment is marked', async () => {
    //todo
  });
});
describe('findAppointmentSelected', () => {
  test('should return appointmet selected on success', async () => {
    const {sut} = makeSut();

    const accountId = 'fake_account_id';

    const result = await sut.findAppointmentSelected(accountId);

    expect(result).toBeTruthy();
    expect(result).toHaveProperty('body');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('accountId');
  });
  test('should return error if findConversationsServiceStub return null', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    const accountId = 'fake_account_id';

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(null));

    await expect(() => sut.findAppointmentSelected(accountId)).rejects.toThrow(
      Error,
    );
  });
});
describe('extractAppointmentList', () => {
  test('should return an object with appointment and list option', () => {
    const {sut} = makeSut();

    const result = sut.extractAppointmentList([
      '09:00',
      '10:00',
      '11:00',
      '12:00',
    ]);

    expect(result.length).toBe(4);
    expect(result).toEqual([
      {option: 1, appointment: '09:00'},
      {option: 2, appointment: '10:00'},
      {option: 3, appointment: '11:00'},
      {option: 4, appointment: '12:00'},
    ]);
  });
  //todo teste sem horario disponivel
});
describe('getStartAndEndAppointment', () => {
  test('should return appointment start and end time', () => {
    const {sut} = makeSut();

    const appointment = '09:00';

    const result = sut.getStartAndEndAppointment(
      appointment,
      mockedTime as any,
    );

    expect(result).toEqual(expect.any(String));
    expect(result.length).toBe(13); //'HH:MM - HH:MM' (09:00 - 10:00)
  });
  //todo incorrect param
});
describe('getDataToNewMeet', () => {
  test('should return meeting entity on success', async () => {
    const {sut, meetingRepositoryStub} = makeSut();

    const fakeAcoountId = 'fake_account_id';
    const appointment = '09:00';

    jest
      .spyOn(meetingRepositoryStub, 'find')
      .mockImplementationOnce(() => Promise.resolve([]));

    const result = await sut.getDataToNewMeet(fakeAcoountId, appointment);

    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('phone');
  });
});

describe('saveAppointment', () => {
  test('should return meeting on success', async () => {
    const {sut} = makeSut();

    const fakeAcoountId = 'fake_account_id';
    const appointment = '09:00';

    jest
      .spyOn(sut, 'getDataToNewMeet')
      .mockImplementationOnce(() => Promise.resolve(fakeMeeting()));

    const result = await sut.saveAppointment(fakeAcoountId, appointment);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');
    expect(result).toHaveProperty('phone');
    expect(result).toHaveProperty('createdAt');
  });
});

describe('getAppointmentMarked', () => {
  test('should return startedDate on success', async () => {
    const {sut, findConversationsServiceStub, meetingRepositoryStub} =
      makeSut();

    const accountId = 'fake_account_id';
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          fakeConversation({
            body: '2',
            options: {1: '09:00', 2: '10:00', 3: '11:00'},
          }),
        );
      });

    jest
      .spyOn(meetingRepositoryStub, 'find')
      .mockImplementationOnce(() => Promise.resolve([]));

    const result = await sut.getAppointmentMarked(accountId);

    expect(result).toHaveProperty('startedDate');
  });
  test('should return STEP_NOT_IMPLEMETED error if appointment selected is not a number', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    const accountId = 'fake_account_id';
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          fakeConversation({
            body: 'aaaaaa',
            options: {1: '09:00', 2: '10:00', 3: '11:00'},
          }),
        );
      });

    await expect(() => sut.getAppointmentMarked(accountId)).rejects.toThrow(
      STEP_NOT_IMPLEMETED,
    );
  });
  test('should return type NEW_APPOINTMENT if OPTION_RETRY_DATE_APPOINTMENT is selected (option 0)', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    const accountId = 'fake_account_id';
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          fakeConversation({
            body: '0',
            options: {1: '09:00', 2: '10:00', 3: '11:00'},
          }),
        );
      });

    const result = await sut.getAppointmentMarked(accountId);

    expect(result).toBe(Step.AppointmentResultEnum.NEW_APPOINTMENT);
  });
  test('should return STEP_NOT_IMPLEMETED if option selected not exists', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    const accountId = 'fake_account_id';
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          fakeConversation({
            body: '7',
            options: {1: '09:00', 2: '10:00', 3: '11:00'},
          }),
        );
      });

    await expect(() => sut.getAppointmentMarked(accountId)).rejects.toThrow(
      STEP_NOT_IMPLEMETED,
    );
  });
});

describe('findMeetingIsAvaliable', () => {
  test('should calls meeting repository sub with correct values', async () => {
    const {sut, meetingRepositoryStub} = makeSut();

    const spyOn = jest.spyOn(meetingRepositoryStub, 'find');

    const phone = 999999;
    const startDate = mockedTime;
    const endDate = mockedTime;

    const result = await sut.findMeetingIsAvaliable({
      startDate,
      endDate,
      phone,
    });

    expect(result).toBeTruthy();
    expect(spyOn).toBeCalledWith({
      where: {
        phone,
        startDate,
        endDate,
      },
    });
  });
});
