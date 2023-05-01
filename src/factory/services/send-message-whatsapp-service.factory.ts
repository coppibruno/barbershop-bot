import {GetConversationTwilio} from '../../external/twilio/get-conversation';
import {TwilioSendWhatsappMessage} from '../../external/twilio/send-new-message';
import ConversationRepository from '../../repositories/conversationRepository';
import {FindConversationsService} from '../../services/find-conversation.service';
import {SendMessageWhatsappService} from '../../services/send-message.service';

export const SendMessageWhatsappServiceFactory = () => {
  const conversationRepository = new ConversationRepository();
  const findConversationsService = new FindConversationsService(
    conversationRepository,
  );
  const getConversationTwilio = new GetConversationTwilio(
    findConversationsService,
  );
  const externalService = new TwilioSendWhatsappMessage(getConversationTwilio);
  return new SendMessageWhatsappService(externalService);
};
