import {Twilio} from 'twilio';
import {ConversationEntity} from '../../entity';
import {TwilioSendWhatsappMessage} from '../twilio/send-new-message';

export abstract class TwilioConnect {
  static connect(): Twilio | null {
    return null;
  }
}

export class TwilioSendWhatsappMessageStub
  implements TwilioSendWhatsappMessage
{
  public connection = TwilioConnect.connect();
  async sendMessage(conversationEntity: ConversationEntity): Promise<void> {
    Promise.resolve(this.connection);
  }
}
