import {SendWhatsappMessage} from '../../interfaces/sendMessage';
import ResponseSendMessage from '../../interfaces/sendMessage/response';
import {TwilioConnect} from './connect';

export class TwilioSendWhatsappMessage implements SendWhatsappMessage {
  private connection = TwilioConnect.connect();

  async sendMessage(body: string): Promise<ResponseSendMessage> {
    if (!body) {
      throw new Error('body is required');
    }

    const result = await this.connection.messages.create({
      from: 'whatsapp:+14155238886',
      body,
      to: 'whatsapp:+554796913897',
    });

    const data: ResponseSendMessage = {
      body: result.body,
      status: result.status,
      created: result.dateCreated,
      from: result.from,
      to: result.to,
    };

    return data;
  }
}
