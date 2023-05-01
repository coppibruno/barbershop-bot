import {IConversationTwilio} from '../../interfaces/external';
import {SendWhatsappMessage} from '../../interfaces/sendMessage';
import ResponseSendMessage from '../../interfaces/sendMessage/response';
import {TwilioConnect} from './connect';
import 'dotenv/config';
import {GetConversationTwilio} from './get-conversation';
import {ConversationEntity} from '../../entity/conversation';

const BOT_NUMBER = process.env.BOT_NUMBER;

export class TwilioSendWhatsappMessage implements SendWhatsappMessage {
  private connection = TwilioConnect.connect();

  constructor(private readonly getConversationTwilio: GetConversationTwilio) {}

  async sendMessage(data: {
    from: number;
    body: string;
    to: number;
  }): Promise<ConversationEntity> {
    if (!data.body) {
      throw new Error('body is required');
    }

    const result = await this.connection.messages.create({
      from: `whatsapp:+${BOT_NUMBER}`,
      body: data.body,
      to: `whatsapp:+${data.to}`,
    });

    const parameters: IConversationTwilio = {
      From: result.from,
      To: result.to,
      AccountSid: result.accountSid,
      Body: result.body,
      MessageSid: result.sid,
    };

    const conversationEntity = await this.getConversationTwilio.execute(
      parameters,
    );

    return conversationEntity;
  }
}
