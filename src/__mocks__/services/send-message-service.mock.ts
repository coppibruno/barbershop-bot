import {ConversationEntity} from '@/entity/conversation.entity';
import {TwilioSendWhatsappMessageStub} from '@/__mocks__/external/twilio-send-whatsapp-message.mock';
import {SendMessageWhatsappService} from '@/services/send-message.service';

export class SendMessageWhatsappServiceStub extends SendMessageWhatsappService {
  private readonly serviceSenderMessageStub: TwilioSendWhatsappMessageStub;

  constructor(serviceSenderMessageStub: TwilioSendWhatsappMessageStub) {
    super(serviceSenderMessageStub);
  }

  async execute(conversationEntity: ConversationEntity): Promise<void> {
    return Promise.resolve();
  }
}
