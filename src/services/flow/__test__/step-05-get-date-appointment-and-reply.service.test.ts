import * as Step from '../step-05-get-date-appointment-and-reply.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  FindMeetingsOfDayServiceStub,
  GetPhoneByAccountStub,
  GetUserNameConversationStub,
  MeetingRepositoryStub,
  SendMessageWhatsappServiceStub,
  StepFindAvaliableDateFlowStub,
  StepResponseByOptionMenuFlowStub,
  TwilioSendWhatsappMessageStub,
  fakeConversation,
  fakeMeeting,
} from '@/__mocks__';
import {
  InvalidDataIsProvidedError,
  InvalidMenuOptionError,
  MEETING_ALREDY_IN_USE,
  NotFoundError,
  STEP_NOT_IMPLEMETED,
} from '../../../errors';
import {faker} from '@faker-js/faker';
import {PadStartDateHelper} from '@/helpers';
import * as TransformAppointment from '@/helpers/transform-appointment-in-date.helper';

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();

  const meetingRepositoryStub = new MeetingRepositoryStub();

  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );
  const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
    meetingRepositoryStub,
  );

  const stepResponseByOptionMenuFlowStub = new StepResponseByOptionMenuFlowStub(
    findConversationsServiceStub,
  );

  const stepFindAvaliableDateFlowStub = new StepFindAvaliableDateFlowStub(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
    stepResponseByOptionMenuFlowStub,
  );

  const getUserNameConversationStub = new GetUserNameConversationStub(
    findConversationsServiceStub,
  );
  const getPhoneByAccountStub = new GetPhoneByAccountStub(
    findConversationsServiceStub,
  );

  const sendMessageWhatsappServiceStub = new SendMessageWhatsappServiceStub(
    new TwilioSendWhatsappMessageStub(),
  );

  const sut = new Step.StepGetDateAndReplyAppointmentFlow(
    findConversationsServiceStub,
    stepFindAvaliableDateFlowStub,
    meetingRepositoryStub,
    getUserNameConversationStub,
    getPhoneByAccountStub,
    sendMessageWhatsappServiceStub,
  );

  return {
    sut,
    findConversationsServiceStub,
    stepFindAvaliableDateFlowStub,
    meetingRepositoryStub,
    sendMessageWhatsappServiceStub,
  };
};

const mockedTime = faker.date.future();

jest
  .spyOn(Step, 'getClone')
  .mockImplementation(() => ({toDate: () => {}} as any));
jest
  .spyOn(Step, 'addDate')
  .mockImplementation(() => ({toDate: () => {}} as any));
jest.spyOn(Step, 'getDay').mockImplementation(() => mockedTime.getDate());
jest
  .spyOn(Step, 'getMonth')
  .mockImplementation(() => mockedTime.getMonth() + 1);
jest.spyOn(Step, 'getHoursMin').mockImplementation(() => {
  const hours = PadStartDateHelper(mockedTime.getHours(), 2);

  const mins = PadStartDateHelper(mockedTime.getMinutes(), 2);

  return `${hours}:${mins}`;
});
jest.spyOn(Step, 'getHours').mockImplementation(() => mockedTime.getHours());
jest.spyOn(Step, 'getMins').mockImplementation(() => mockedTime.getMinutes());
jest
  .spyOn(Step, 'addDate')
  .mockImplementation(() => ({toDate: () => {}} as any));
jest
  .spyOn(Step, 'setHours')
  .mockImplementation(() => ({toDate: () => {}} as any));
jest
  .spyOn(Step, 'setMinutes')
  .mockImplementation(() => ({toDate: () => {}} as any));
jest
  .spyOn(Step, 'setSeconds')
  .mockImplementation(() => ({toDate: () => {}} as any));

jest
  .spyOn(TransformAppointment, 'TransformAppointmentInDateHelper')
  .mockImplementation(() => ({toDate: () => {}} as any));

const optionsMenu = [
  {option: 1, appointment: '09:00'},
  {option: 2, appointment: '10:00'},
  {option: 3, appointment: '11:00'},
];

describe('Step Get Date Appointment And Reply execute', () => {
  test('should return success message that appointment is marked', async () => {
    const {sut, stepFindAvaliableDateFlowStub} = makeSut();
    const accountId = 'fake_account_id';

    jest
      .spyOn(sut, 'saveAppointmentMarked')
      .mockImplementationOnce(() => Promise.resolve({startedDate: mockedTime}));

    jest
      .spyOn(stepFindAvaliableDateFlowStub, 'execute')
      .mockImplementationOnce(() =>
        Promise.resolve({options: ['09:00'], response: '', step: 4}),
      );

    const result = await sut.execute(accountId);

    expect(result.response).toEqual(
      expect.stringMatching(/Horário Agendado com sucesso/i),
    );
    expect(result.step).toBe(5);
  });
  test('should return message a invalid menu', async () => {
    const {sut, stepFindAvaliableDateFlowStub} = makeSut();
    const accountId = 'fake_account_id';

    jest
      .spyOn(sut, 'saveAppointmentMarked')
      .mockImplementationOnce(() =>
        Promise.reject(
          new InvalidDataIsProvidedError('invalid menu is provided'),
        ),
      );

    jest
      .spyOn(stepFindAvaliableDateFlowStub, 'execute')
      .mockImplementationOnce(() =>
        Promise.resolve({options: ['09:00'], response: '', step: 4}),
      );

    const result = await sut.execute(accountId);

    expect(result.response).toEqual(InvalidMenuOptionError.INVALID_MENU_OPTION);
    expect(result.step).toBe(4);
  });
});
describe('findAppointmentSelected', () => {
  test('should return appointmet selected on success', async () => {
    const {sut} = makeSut();

    const accountId = 'fake_account_id';

    const result = await sut.findAppointmentSelected(accountId);

    expect(result).toHaveProperty('option');
    expect(result).toHaveProperty('options');
  });
  test('should return error if findConversationsServiceStub return null', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    const accountId = 'fake_account_id';

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(null));

    await expect(() => sut.findAppointmentSelected(accountId)).rejects.toThrow(
      new NotFoundError('Unable fetch scheduled appointment'),
    );
  });
});

describe('getDataToNewMeet', () => {
  test('should return meeting entity on success', async () => {
    const {sut} = makeSut();

    const fakeAcoountId = 'fake_account_id';
    const appointment = '09:00';

    const result = await sut.getDataToNewMeet(fakeAcoountId, appointment);

    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('phone');
  });
});

describe('saveAppointment', () => {
  test('should return meeting on success', async () => {
    const {sut, meetingRepositoryStub} = makeSut();

    const fakeAcoountId = 'fake_account_id';
    const appointment = '09:00';

    jest
      .spyOn(sut, 'getDataToNewMeet')
      .mockImplementationOnce(() => Promise.resolve(fakeMeeting()));

    jest
      .spyOn(sut, 'findMeetingIsAvaliable')
      .mockImplementationOnce(() => Promise.resolve(null));

    const fakeMeetingData = fakeMeeting();

    jest
      .spyOn(meetingRepositoryStub, 'create')
      .mockImplementationOnce(() => Promise.resolve(fakeMeetingData));

    const spyOn = jest.spyOn(sut, 'sendMessageToAdminWithNewAppointment');

    const result = await sut.saveAppointment(fakeAcoountId, appointment);

    expect(spyOn).toBeCalledWith(fakeMeetingData);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');
    expect(result).toHaveProperty('phone');
    expect(result).toHaveProperty('createdAt');
  });
  test('should return MEETING_ALREDY_IN_USE if meeting alred in use', async () => {
    const {sut} = makeSut();

    const fakeAcoountId = 'fake_account_id';
    const appointment = '09:00';

    jest
      .spyOn(sut, 'getDataToNewMeet')
      .mockImplementationOnce(() => Promise.resolve(fakeMeeting()));

    jest
      .spyOn(sut, 'findMeetingIsAvaliable')
      .mockImplementationOnce(() => Promise.resolve(fakeMeeting()));

    await expect(() =>
      sut.saveAppointment(fakeAcoountId, appointment),
    ).rejects.toThrow(MEETING_ALREDY_IN_USE);
  });
});

describe('saveAppointmentMarked', () => {
  test('should return startedDate on success', async () => {
    const {sut} = makeSut();

    const accountId = 'fake_account_id';
    jest.spyOn(sut, 'findAppointmentSelected').mockImplementationOnce(() =>
      Promise.resolve({
        option: 1,
        options: optionsMenu,
      }),
    );
    jest
      .spyOn(sut, 'saveAppointment')
      .mockImplementationOnce(() => Promise.resolve(fakeMeeting()));

    const result = await sut.saveAppointmentMarked(accountId);

    expect(result).toHaveProperty('startedDate');
  });
  test('should return invalid menu is provided error if appointment selected is not a number', async () => {
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

    await expect(() => sut.saveAppointmentMarked(accountId)).rejects.toThrow(
      new InvalidDataIsProvidedError('invalid menu is provided'),
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

    const result = await sut.saveAppointmentMarked(accountId);

    expect(result).toBe(Step.AppointmentResultEnum.NEW_APPOINTMENT);
  });
  test('should return invalid menu is provided if option selected not exists', async () => {
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

    await expect(() => sut.saveAppointmentMarked(accountId)).rejects.toThrow(
      new InvalidDataIsProvidedError('invalid menu is provided'),
    );
  });
});

describe('findMeetingIsAvaliable', () => {
  test('should calls meeting repository with correct values', async () => {
    const {sut, meetingRepositoryStub} = makeSut();

    const spyOn = jest.spyOn(meetingRepositoryStub, 'findOne');

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
describe('sendMessageToAdminWithNewAppointment', () => {
  test('should calls admin send whatsapp service with correct values', async () => {
    const {sut, sendMessageWhatsappServiceStub} = makeSut();

    const spyOn = jest.spyOn(sendMessageWhatsappServiceStub, 'execute');

    await sut.sendMessageToAdminWithNewAppointment(fakeMeeting());

    expect(spyOn).toBeCalled();
  });
});
