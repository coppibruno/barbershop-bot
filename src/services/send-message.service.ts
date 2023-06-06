import {ConversationEntity} from '@/entity/conversation.entity';
import {TwilioSendWhatsappMessage} from '@/external/twilio/send-new-message';
/**
 * Envia uma mensagem whatsapp pelo twilio
 */
export class SendMessageWhatsappService {
  private readonly serviceSenderMessage;

  constructor(serviceSenderMessage: TwilioSendWhatsappMessage) {
    this.serviceSenderMessage = serviceSenderMessage;
  }

  async execute(conversationEntity: ConversationEntity): Promise<void> {
    this.serviceSenderMessage.sendMessage(conversationEntity);
  }
}
