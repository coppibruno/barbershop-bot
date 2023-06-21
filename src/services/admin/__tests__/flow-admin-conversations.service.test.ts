import {ConversationEntity} from '@/entity';
import {GetConversationTwilio} from '@/external/twilio/get-conversation';
import {TwilioSendWhatsappMessage} from '@/external/twilio/send-new-message';
import {IConversationTwilio} from '@/interfaces/external';
import * as Service from '../flow-admin-conversations.service';
import {SendMessageWhatsappService} from '@/services/send-message.service';
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
  WelcomeAdminAndShowMenuStub,
  AdminRunOptionStub,
  DisableMeetingsOfIntervalServiceStub,
  AdminRunOptionPersistsStub,
  AdminResponseByOptionMenuStub,
  GetAdminResponseByAccountServiceStub,
  TwilioSendWhatsappMessageStub,
  SendMessageWhatsappServiceStub,
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
      getPhoneByAccountIdConversationStub,
      sendMessageWhatsappServiceStub,
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
  const getAdminResponseByAccountServiceStub =
    makeGetAdminReponseByAccountStub();

  const sut = new Service.FlowAdminConversationService(
    getConversationTwilioStub,
    createConversationServiceStub,
    getAdminResponseByAccountServiceStub,
    sendMessageWhatsappServiceStub,
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

/**TODO TEST */

describe('Flow Admin Conversations Service', () => {
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
    console.log(result);
    expect(result).toEqual(expect.any(String));
  });
});
