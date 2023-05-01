import {ConversationEntity} from '../entity/conversationEntity';
import {TwilioSendWhatsappMessage} from '../external/twilio/send-new-message';

export class SendMessageWhatsappService {
  private readonly serviceSenderMessage;

  constructor(serviceSenderMessage: TwilioSendWhatsappMessage) {
    this.serviceSenderMessage = serviceSenderMessage;
  }

  async execute(conversationEntity: ConversationEntity): Promise<void> {
    this.serviceSenderMessage.sendMessage(conversationEntity);
  }
}
