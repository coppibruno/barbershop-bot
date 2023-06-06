import {ConversationEntity} from '../../entity';
import {GetConversationTwilio} from '../../external/twilio/get-conversation';
import {TwilioSendWhatsappMessage} from '../../external/twilio/send-new-message';
import {IConversationTwilio} from '../../interfaces/external';
import * as Service from '../flow-conversations.service';
import {SendMessageWhatsappService} from '../send-message.service';
import {
  ConversationRepositoryStub,
  CreateConversationServiceStub,
  FindConversationsServiceStub,
  FindMeetingsOfDayServiceStub,
  GetLastMessageInProgressConversationServiceStub,
  GetPhoneByAccountStub,
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
} from '@/__mocks__';

class GetConversationTwilioStub extends GetConversationTwilio {
  execute(iConversationTwilio: IConversationTwilio): ConversationEntity {
    return fakeConversation();
  }
}

const makeSendMessageWhatsappService = () => {
  class TwilioSendWhatsappMessageStub extends TwilioSendWhatsappMessage {
    async sendMessage(conversationEntity: ConversationEntity): Promise<void> {
      return Promise.resolve();
    }
  }
  class SendMessageWhatsappServiceStub extends SendMessageWhatsappService {
    private readonly serviceSenderMessageStub;

    constructor(serviceSenderMessageStub: TwilioSendWhatsappMessage) {
      super(serviceSenderMessageStub);
    }

    async execute(conversationEntity: ConversationEntity): Promise<void> {
      return Promise.resolve();
    }
  }

  return new SendMessageWhatsappServiceStub(
    new TwilioSendWhatsappMessageStub(),
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

  const getPhoneByAccountIdConversationStub = new GetPhoneByAccountStub(
    findConversationsServiceStub,
  );

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
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const getUserNameConversationStub = new GetUserNameConversationStub(
    findConversationsServiceStub,
  );

  const sendMessageWhatsappServiceStub = makeSendMessageWhatsappService();

  const getLastMessageInProgressConversationServiceStub =
    new GetLastMessageInProgressConversationServiceStub(
      findConversationsServiceStub,
    );

  const getResponseByAccountServiceStub = makeGetReponseByAccountStub();
  const sut = new Service.FlowConversationService(
    getConversationTwilioStub,
    createConversationServiceStub,
    getResponseByAccountServiceStub,
    sendMessageWhatsappServiceStub,
    getUserNameConversationStub,
    getLastMessageInProgressConversationServiceStub,
  );

  return {
    sut,
    getConversationTwilioStub,
    createConversationServiceStub,
    getResponseByAccountServiceStub,
    sendMessageWhatsappServiceStub,
    getUserNameConversationStub,
    getLastMessageInProgressConversationServiceStub,
  };
};

describe('Flow Conversations Service', () => {
  test('should return message from robot on success', async () => {
    const {sut} = makeSut();

    const fakeMessageTwilio: IConversationTwilio = {
      AccountSid: 'fake_account_id',
      Body: 'any message from user',
      From: '+55999999999',
      MessageSid: 'fake_message_id',
      To: '+5511111111',
    };

    const result = await sut.execute(fakeMessageTwilio);

    expect(result).toEqual(expect.any(String));
  });
});
