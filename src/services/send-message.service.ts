import {SendWhatsappMessage} from '../interfaces/sendMessage';
import ResponseSendMessage from '../interfaces/sendMessage/response';

export class SendMessageWhatsappService {
  private readonly serviceSenderMessage;

  constructor(serviceSenderMessage: SendWhatsappMessage) {
    this.serviceSenderMessage = serviceSenderMessage;
  }

  async execute(body: string): Promise<ResponseSendMessage> {
    return this.serviceSenderMessage.sendMessage(body);
  }
}
