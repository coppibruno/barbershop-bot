import {TwilioConnect} from './connect';
import 'dotenv/config';
import {ConversationEntity} from '../../entity/conversationEntity';

const BOT_NUMBER = process.env.BOT_NUMBER;
/**
 * Classe responsável por enviar mensagem
 */
export class TwilioSendWhatsappMessage {
  private connection = TwilioConnect.connect();

  async sendMessage(conversationEntity: ConversationEntity): Promise<void> {
    const {body, toPhone} = conversationEntity;
    if (!body) {
      throw new Error('body is required');
    }

    await this.connection.messages.create({
      from: `whatsapp:+${BOT_NUMBER}`,
      body,
      to: `whatsapp:+${toPhone}`,
    });
  }
}
