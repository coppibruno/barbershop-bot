import {STEP_NOT_IMPLEMETED} from '@/errors';

import * as Service from '../get-admin-response-by-account.service';
import {
  AdminResponseByOptionMenuStub,
  AdminRunOptionPersistsStub,
  AdminRunOptionStub,
  ConversationRepositoryStub,
  DisableMeetingsOfIntervalServiceStub,
  FindConversationsServiceStub,
  FindMeetingsOfDayServiceStub,
  GetStepConversationStub,
  MeetingRepositoryStub,
  WelcomeAdminAndShowMenuStub,
} from '@/__mocks__';

const getDependencies = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const meetingRepositoryStub = new MeetingRepositoryStub();
  const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
    meetingRepositoryStub,
  );

  return {
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
    meetingRepositoryStub,
  };
};

const makeSut = () => {
  const {
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
    meetingRepositoryStub,
  } = getDependencies();

  const getStepConversationStub = new GetStepConversationStub(
    findConversationsServiceStub,
  );
  const stepWelcomeFlowStub = new WelcomeAdminAndShowMenuStub();

  const stepAdminRunOptionStub = new AdminRunOptionStub(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
  );

  const disableMeetingsOfIntervalServiceStub =
    new DisableMeetingsOfIntervalServiceStub(meetingRepositoryStub);

  const stepAdminRunOptionPersistsStub = new AdminRunOptionPersistsStub(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
    disableMeetingsOfIntervalServiceStub,
  );
  const stepAdminResponseByOptionMenuStub = new AdminResponseByOptionMenuStub(
    findConversationsServiceStub,
  );

  const sut = new Service.GetAdminResponseByAccountService(
    getStepConversationStub,
    stepWelcomeFlowStub,
    stepAdminRunOptionStub,
    stepAdminRunOptionPersistsStub,
    stepAdminResponseByOptionMenuStub,
  );
  return {
    sut,
    getStepConversationStub,
    stepWelcomeFlowStub,
    stepAdminRunOptionStub,
    stepAdminRunOptionPersistsStub,
    stepAdminResponseByOptionMenuStub,
  };
};

describe('Get Admin Response By Account Service', () => {
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
    const {sut, getStepConversationStub, stepAdminResponseByOptionMenuStub} =
      makeSut();
    const account = 'fake_account_id';

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(2));

    const spyOn = jest.spyOn(stepAdminResponseByOptionMenuStub, 'execute');

    const result = await sut.execute(account);

    expect(result.step).toBe(2);
    expect(spyOn).toBeCalledWith(account);
    expect(result.response).toEqual(expect.any(String));
  });
  test('should return correct message reponse and step 3', async () => {
    const {sut, getStepConversationStub, stepAdminRunOptionStub} = makeSut();
    const account = 'fake_account_id';

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(3));

    const spyOn = jest.spyOn(stepAdminRunOptionStub, 'execute');

    const result = await sut.execute(account);

    expect(result.step).toBe(3);
    expect(spyOn).toBeCalledWith(account);
    expect(result.response).toEqual(expect.any(String));
  });
  test('should return correct message reponse and step 4', async () => {
    const {sut, getStepConversationStub, stepAdminRunOptionPersistsStub} =
      makeSut();
    const account = 'fake_account_id';

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(4));

    const spyOn = jest.spyOn(stepAdminRunOptionPersistsStub, 'execute');

    const result = await sut.execute(account);

    expect(result.step).toBe(4);
    expect(spyOn).toBeCalledWith(account);
    expect(result.response).toEqual(expect.any(String));
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
    const {
      sut,
      getStepConversationStub,
      stepAdminRunOptionPersistsStub,
      stepAdminRunOptionStub,
    } = makeSut();
    const account = 'fake_account_id';

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(4));

    jest
      .spyOn(stepAdminRunOptionPersistsStub, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('fake error');
      });

    const spyOn = jest.spyOn(stepAdminRunOptionStub, 'execute');

    const result = await sut.execute(account);
    expect(result.step).toBe(3);
    expect(spyOn).toBeCalledWith(account);
    expect(result.response).toEqual(expect.any(String));
  });
});
