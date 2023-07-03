import {IConversationTwilio} from '@/interfaces';
import {
  CreateConversationServiceStub,
  GetLastMessageInProgressConversationServiceStub,
  SendMessageWhatsappServiceStub,
  GetAdminResponseByAccountServiceStub,
  fakeConversation,
} from '@/__mocks__';
import {GetConversationTwilio} from '@/external/twilio/get-conversation';
import {FlowAdminConversationService} from '@/services/admin';

export class FlowAdminConversationServiceStub extends FlowAdminConversationService {
  constructor(
    private readonly getConversationTwilioStub: GetConversationTwilio,
    private readonly createConversationServiceStub: CreateConversationServiceStub,
    private readonly getAdminResponseByAccountServiceStub: GetAdminResponseByAccountServiceStub,
    private readonly sendMessageWhatsappServiceStub: SendMessageWhatsappServiceStub,
    private readonly getLastMessageInProgressConversationServiceStub: GetLastMessageInProgressConversationServiceStub,
  ) {
    super(
      getConversationTwilioStub,
      createConversationServiceStub,
      getAdminResponseByAccountServiceStub,
      sendMessageWhatsappServiceStub,
      getLastMessageInProgressConversationServiceStub,
    );
  }

  async execute(message: IConversationTwilio): Promise<string> {
    const senderConversationEntity = fakeConversation();

    const lastMessage =
      await this.getLastMessageInProgressConversationServiceStub.execute(
        senderConversationEntity.fromPhone,
      );

    if (lastMessage) {
      senderConversationEntity.protocol = lastMessage.protocol;
      senderConversationEntity.step = lastMessage.step;
      senderConversationEntity.name = lastMessage.name;
      senderConversationEntity.options = lastMessage.options;
    }

    await this.createConversationServiceStub.execute(senderConversationEntity);

    const reply = await this.getAdminResponseByAccountServiceStub.execute(
      senderConversationEntity.fromPhone,
    );
    const {response} = reply;

    const botAnswer = fakeConversation();

    await this.sendMessageWhatsappServiceStub.execute(botAnswer);

    await this.createConversationServiceStub.execute(botAnswer);

    return response;
  }
}
