import {ConversationEntity} from '../entity/conversation';
import {TwilioSendWhatsappMessage} from '../external/twilio/send-new-message';
import ResponseSendMessage from '../interfaces/sendMessage/response';

export class SendMessageWhatsappService {
  private readonly serviceSenderMessage;

  constructor(serviceSenderMessage: TwilioSendWhatsappMessage) {
    this.serviceSenderMessage = serviceSenderMessage;
  }

  async execute(data: {
    from: number;
    body: string;
    to: number;
  }): Promise<ConversationEntity> {
    return this.serviceSenderMessage.sendMessage(data);
  }
}
