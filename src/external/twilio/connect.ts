import {Twilio} from 'twilio';
import 'dotenv/config';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
/**
 * Classe responsável por criar a instância da classe de comunicação com o twilio
 */
export abstract class TwilioConnect {
  static connect() {
    if (!accountSid || !authToken) {
      throw new Error('credetials twilio not found');
    }
    return new Twilio(accountSid, authToken);
  }
}
