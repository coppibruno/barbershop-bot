import {TwilioSendWhatsappMessage} from '../../external/twilio/send-new-message';
import {SendMessageWhatsappService} from '../../services/send-message.service';

export const SendMessageWhatsappServiceFactory = () => {
  const externalService = new TwilioSendWhatsappMessage();
  return new SendMessageWhatsappService(externalService);
};
