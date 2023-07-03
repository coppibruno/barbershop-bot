import {ConversationEntity} from '../../entity';
import {GetConversationTwilio} from '../../external/twilio/get-conversation';
import {IConversationTwilio} from '../../interfaces/external';
import * as Service from '../flow-conversations.service';
import {
  ConversationRepositoryStub,
  CreateConversationServiceStub,
  FindConversationsServiceStub,
  FindMeetingsOfDayServiceStub,
  GetLastMessageInProgressConversationServiceStub,
  GetStepConversationStub,
  GetUserNameConversationStub,
  MeetingRepositoryStub,
  fakeConversation,
  StepFindAvaliableDateFlowStub,
  StepGetDateAndReplyAppointmentFlowStub,
  StepResponseByOptionMenuFlowStub,
  StepShowMenuFlowStub,
  StepWelcomeFlowStub,
  GetResponseByAccountServiceStub,
  FlowAdminConversationServiceStub,
  GetAdminResponseByAccountServiceStub,
  WelcomeAdminAndShowMenuStub,
  AdminRunOptionStub,
  AdminRunOptionPersistsStub,
  DisableMeetingsOfIntervalServiceStub,
  SendMessageWhatsappServiceStub,
  TwilioSendWhatsappMessageStub,
  AdminResponseByOptionMenuStub,
  ExceededLimitOfMeetingsServiceStub,
  GetProtocolByPhoneConversationStub,
} from '@/__mocks__';

class GetConversationTwilioStub extends GetConversationTwilio {
  execute(iConversationTwilio: IConversationTwilio): ConversationEntity {
    return fakeConversation();
  }
}

const makeGetAdminReponseByAccountStub = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const meetingRepositoryStub = new MeetingRepositoryStub();
  const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
    meetingRepositoryStub,
  );

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

  return new GetAdminResponseByAccountServiceStub(
    getStepConversationStub,
    stepWelcomeFlowStub,
    stepAdminRunOptionStub,
    stepAdminRunOptionPersistsStub,
    stepAdminResponseByOptionMenuStub,
  );
};

const makeGetReponseByAccountStub = () => {
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

  const sendMessageWhatsappServiceStub = new SendMessageWhatsappServiceStub(
    new TwilioSendWhatsappMessageStub(),
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
  return new GetResponseByAccountServiceStub(
    getStepConversationStub,
    stepWelcomeFlowStub,
    stepShowMenuFlowStub,
    stepResponseByOptionMenuFlowStub,
    stepFindAvaliableDateFlowStub,
    stepGetDateAndReplyAppointmentFlowStub,
  );
};

const makeSut = () => {
  const getConversationTwilioStub = new GetConversationTwilioStub();
  const conversationRepository = new ConversationRepositoryStub();
  const createConversationServiceStub = new CreateConversationServiceStub(
    conversationRepository,
  );

  const conversationRepositoryStub = new ConversationRepositoryStub();
  const meetingRepositoryStub = new MeetingRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const getUserNameConversationStub = new GetUserNameConversationStub(
    findConversationsServiceStub,
  );

  const sendMessageWhatsappServiceStub = new SendMessageWhatsappServiceStub(
    new TwilioSendWhatsappMessageStub(),
  );

  const getLastMessageInProgressConversationServiceStub =
    new GetLastMessageInProgressConversationServiceStub(
      findConversationsServiceStub,
    );

  const getAdminResponseByAccountServiceStub =
    makeGetAdminReponseByAccountStub();

  const flowAdminConversationServiceStub = new FlowAdminConversationServiceStub(
    getConversationTwilioStub,
    createConversationServiceStub,
    getAdminResponseByAccountServiceStub,
    sendMessageWhatsappServiceStub,
    getLastMessageInProgressConversationServiceStub,
    conversationRepositoryStub,
  );

  const exceededLimitOfMeetingsServiceStub =
    new ExceededLimitOfMeetingsServiceStub(meetingRepositoryStub);

  const getResponseByAccountServiceStub = makeGetReponseByAccountStub();
  const sut = new Service.FlowConversationService(
    getConversationTwilioStub,
    createConversationServiceStub,
    getResponseByAccountServiceStub,
    sendMessageWhatsappServiceStub,
    getUserNameConversationStub,
    getLastMessageInProgressConversationServiceStub,
    flowAdminConversationServiceStub,
    exceededLimitOfMeetingsServiceStub,
    conversationRepository,
  );

  return {
    sut,
    getConversationTwilioStub,
    createConversationServiceStub,
    getResponseByAccountServiceStub,
    sendMessageWhatsappServiceStub,
    getUserNameConversationStub,
    getLastMessageInProgressConversationServiceStub,
    flowAdminConversationServiceStub,
    exceededLimitOfMeetingsServiceStub,
  };
};
const fakeMessageTwilio: IConversationTwilio = {
  AccountSid: 'fake_account_id',
  Body: 'any message from user',
  From: '+55999999999',
  MessageSid: 'fake_message_id',
  To: '+5511111111',
};

describe('Flow Conversations Service', () => {
  test('should return message from robot on success', async () => {
    const {sut} = makeSut();

    const result = await sut.execute(fakeMessageTwilio);

    expect(result).toEqual(expect.any(String));
  });
  test('should call admin service flow if phone is admin phone', async () => {
    const {sut, flowAdminConversationServiceStub, getConversationTwilioStub} =
      makeSut();
    const spyOn = jest.spyOn(flowAdminConversationServiceStub, 'execute');

    const adminPhone = 55111111111;
    jest.replaceProperty(sut, 'adminNumber', adminPhone);
    const account_id = 'fake_account_id';
    jest.spyOn(getConversationTwilioStub, 'execute').mockReturnValueOnce({
      name: '',
      fromPhone: adminPhone,
      toPhone: 55999999999,
      body: 'any',
      messageId: 'any',
      step: null,
      state: 'IN_PROGRESS',
      options: {},
      accountId: account_id,
      protocol: Date.now(),
    });

    await sut.execute(fakeMessageTwilio);
    expect(spyOn).toBeCalledWith(fakeMessageTwilio);
  });
  test('should return if exceeded limit service return true', async () => {
    const {
      sut,
      flowAdminConversationServiceStub,
      exceededLimitOfMeetingsServiceStub,
    } = makeSut();
    const spyOn = jest.spyOn(flowAdminConversationServiceStub, 'execute');

    jest
      .spyOn(exceededLimitOfMeetingsServiceStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(true));

    const result = await sut.execute(fakeMessageTwilio);

    expect(result).toBeUndefined();
    expect(spyOn).not.toHaveBeenCalled();
  });
});
