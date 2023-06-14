import {STEP_NOT_IMPLEMETED} from '../../errors';

import * as Service from '../get-response-by-account.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  FindMeetingsOfDayServiceStub,
  GetPhoneByAccountStub,
  GetStepConversationStub,
  GetUserNameConversationStub,
  MeetingRepositoryStub,
  StepFindAvaliableDateFlowStub,
  StepGetDateAndReplyAppointmentFlowStub,
  StepResponseByOptionMenuFlowStub,
  StepShowMenuFlowStub,
  StepWelcomeFlowStub,
} from '@/__mocks__';

const getDependencies = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const getUserNameConversationStub = new GetUserNameConversationStub(
    findConversationsServiceStub,
  );

  const meetingRepositoryStub = new MeetingRepositoryStub();
  const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
    meetingRepositoryStub,
  );

  const stepFindAvaliableDateFlowStub = new StepFindAvaliableDateFlowStub(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
  );
  const getPhoneByAccountIdConversationStub = new GetPhoneByAccountStub(
    findConversationsServiceStub,
  );

  return {
    findConversationsServiceStub,
    getUserNameConversationStub,
    findMeetingsOfDayServiceStub,
    stepFindAvaliableDateFlowStub,
    getPhoneByAccountIdConversationStub,
    meetingRepositoryStub,
  };
};

const makeSut = () => {
  const {
    findConversationsServiceStub,
    getUserNameConversationStub,
    findMeetingsOfDayServiceStub,
    getPhoneByAccountIdConversationStub,
    meetingRepositoryStub,
  } = getDependencies();

  const getStepConversationStub = new GetStepConversationStub(
    findConversationsServiceStub,
  );
  const stepWelcomeFlowStub = new StepWelcomeFlowStub();
  const stepShowMenuFlowStub = new StepShowMenuFlowStub(
    getUserNameConversationStub,
  );
  const stepResponseByOptionMenuFlowStub = new StepResponseByOptionMenuFlowStub(
    findConversationsServiceStub,
  );
  const stepFindAvaliableDateFlowStub = new StepFindAvaliableDateFlowStub(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
  );
  const stepGetDateAndReplyAppointmentFlowStub =
    new StepGetDateAndReplyAppointmentFlowStub(
      findConversationsServiceStub,
      stepFindAvaliableDateFlowStub,
      meetingRepositoryStub,
      getUserNameConversationStub,
      getPhoneByAccountIdConversationStub,
    );

  const sut = new Service.GetResponseByAccountService(
    getStepConversationStub,
    stepWelcomeFlowStub,
    stepShowMenuFlowStub,
    stepResponseByOptionMenuFlowStub,
    stepFindAvaliableDateFlowStub,
    stepGetDateAndReplyAppointmentFlowStub,
  );
  return {
    sut,
    getStepConversationStub,
    stepWelcomeFlowStub,
    stepShowMenuFlowStub,
    stepResponseByOptionMenuFlowStub,
    stepFindAvaliableDateFlowStub,
    stepGetDateAndReplyAppointmentFlowStub,
  };
};

describe('Get Response By Account Service', () => {
  test('should return correct message reponse and step 1', async () => {
    const {sut, getStepConversationStub} = makeSut();
    const account = 'fake_account_id';

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(1));

    const result = await sut.execute(account);

    expect(result.step).toBe(1);
    expect(result.response).toBe('message_step_1');
  });
  test('should return correct message reponse and step 2', async () => {
    const {sut, getStepConversationStub} = makeSut();
    const account = 'fake_account_id';

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(2));

    const result = await sut.execute(account);

    expect(result.step).toBe(2);
    expect(result.response).toBe('message_step_2');
  });
  test('should return correct message reponse and step 3', async () => {
    const {sut, getStepConversationStub} = makeSut();
    const account = 'fake_account_id';

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(3));

    const result = await sut.execute(account);

    expect(result.step).toBe(3);
    expect(result.response).toBe('message_step_3');
  });
  test('should return correct message reponse and step 4', async () => {
    const {sut, getStepConversationStub} = makeSut();
    const account = 'fake_account_id';

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(4));

    const result = await sut.execute(account);

    expect(result.step).toBe(4);
    expect(result.response).toBe('message_step_4');
  });
  test('should return correct message reponse and step 5', async () => {
    const {sut, getStepConversationStub} = makeSut();
    const account = 'fake_account_id';

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(5));

    const result = await sut.execute(account);

    expect(result.step).toBe(5);
    expect(result.response).toBe('message_step_5');
  });
  test('should return STEP_NOT_IMPLEMETED if step is not integrated', async () => {
    const {sut, getStepConversationStub} = makeSut();
    const account = 'fake_account_id';

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(100));

    await expect(() => sut.execute(account)).rejects.toThrow(
      STEP_NOT_IMPLEMETED,
    );
  });
  test('should must call the previous step if an error occurs', async () => {
    const {sut, getStepConversationStub, stepFindAvaliableDateFlowStub} =
      makeSut();
    const account = 'fake_account_id';

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(4));

    jest
      .spyOn(stepFindAvaliableDateFlowStub, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('fake error');
      });

    const result = await sut.execute(account);
    expect(result.step).toBe(3);
    expect(result.response).toBe('message_step_3');
  });
});
