import {STEP_NOT_IMPLEMETED} from '../../errors';

import * as Service from '../get-response-by-account.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  FindMeetingsOfDayServiceStub,
  GetProtocolByPhoneConversationStub,
  GetStepConversationStub,
  GetUserNameConversationStub,
  MeetingRepositoryStub,
  SendMessageWhatsappServiceStub,
  StepFindAvaliableDateFlowStub,
  StepGetDateAndReplyAppointmentFlowStub,
  StepResponseByOptionMenuFlowStub,
  StepShowMenuFlowStub,
  StepWelcomeFlowStub,
  TwilioSendWhatsappMessageStub,
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

  const stepResponseByOptionMenuFlowStub = new StepResponseByOptionMenuFlowStub(
    findConversationsServiceStub,
  );

  const stepFindAvaliableDateFlowStub = new StepFindAvaliableDateFlowStub(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
    stepResponseByOptionMenuFlowStub,
  );

  return {
    findConversationsServiceStub,
    getUserNameConversationStub,
    findMeetingsOfDayServiceStub,
    stepFindAvaliableDateFlowStub,
    meetingRepositoryStub,
  };
};

const makeSut = () => {
  const {
    findConversationsServiceStub,
    getUserNameConversationStub,
    findMeetingsOfDayServiceStub,
    meetingRepositoryStub,
  } = getDependencies();

  const getStepConversationStub = new GetStepConversationStub(
    findConversationsServiceStub,
  );
  const stepWelcomeFlowStub = new StepWelcomeFlowStub();
  const getProtocolByPhoneConversationStub =
    new GetProtocolByPhoneConversationStub(findConversationsServiceStub);

  const stepShowMenuFlowStub = new StepShowMenuFlowStub(
    getUserNameConversationStub,
    getProtocolByPhoneConversationStub,
  );
  const stepResponseByOptionMenuFlowStub = new StepResponseByOptionMenuFlowStub(
    findConversationsServiceStub,
  );
  const stepFindAvaliableDateFlowStub = new StepFindAvaliableDateFlowStub(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
    stepResponseByOptionMenuFlowStub,
  );

  const twilioSendWhatsappMessageStub = new TwilioSendWhatsappMessageStub();
  const sendMessageWhatsappServiceStub = new SendMessageWhatsappServiceStub(
    twilioSendWhatsappMessageStub,
  );

  const stepGetDateAndReplyAppointmentFlowStub =
    new StepGetDateAndReplyAppointmentFlowStub(
      findConversationsServiceStub,
      stepFindAvaliableDateFlowStub,
      meetingRepositoryStub,
      getUserNameConversationStub,
      sendMessageWhatsappServiceStub,
      getProtocolByPhoneConversationStub,
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
const phone = 5599999999;
describe('Get Response By Account Service', () => {
  test('should return correct message reponse and step 1', async () => {
    const {sut, getStepConversationStub} = makeSut();

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(1));

    const result = await sut.execute(phone);

    expect(result.step).toBe(1);
    expect(result.response).toBe('message_step_1');
  });
  test('should return correct message reponse and step 2', async () => {
    const {sut, getStepConversationStub} = makeSut();

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(2));

    const result = await sut.execute(phone);

    expect(result.step).toBe(2);
    expect(result.response).toBe('message_step_2');
  });
  test('should return correct message reponse and step 3', async () => {
    const {sut, getStepConversationStub} = makeSut();

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(3));

    const result = await sut.execute(phone);

    expect(result.step).toBe(3);
    expect(result.response).toBe('message_step_3');
  });
  test('should return correct message reponse and step 4', async () => {
    const {sut, getStepConversationStub} = makeSut();

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(4));

    const result = await sut.execute(phone);

    expect(result.step).toBe(4);
    expect(result.response).toBe('message_step_4');
  });
  test('should return correct message reponse and step 5', async () => {
    const {sut, getStepConversationStub} = makeSut();

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(5));

    const result = await sut.execute(phone);

    expect(result.step).toBe(5);
    expect(result.response).toBe('message_step_5');
  });
  test('should return STEP_NOT_IMPLEMETED if step is not integrated', async () => {
    const {sut, getStepConversationStub} = makeSut();

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(100));

    await expect(() => sut.execute(phone)).rejects.toThrow(STEP_NOT_IMPLEMETED);
  });
  test('should must call the previous step if an error occurs', async () => {
    const {sut, getStepConversationStub, stepFindAvaliableDateFlowStub} =
      makeSut();

    jest
      .spyOn(getStepConversationStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(4));

    jest
      .spyOn(stepFindAvaliableDateFlowStub, 'execute')
      .mockImplementationOnce(() => {
        throw new Error('fake error');
      });

    const result = await sut.execute(phone);
    expect(result.step).toBe(3);
    expect(result.response).toBe('message_step_3');
  });
});
