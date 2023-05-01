//external
import {GetConversationTwilio} from '../../external/twilio/get-conversation';

//factories
import {CreateConversationServiceFactory} from './create-conversation-service.factory';
import {GetResponseByAccountServiceFactory} from './get-response-by-account-service.factory';
import {SendMessageWhatsappServiceFactory} from '../integration/send-message-whatsapp-service.factory';

//services
import {FlowConversationService} from '../../services/flow-conversations.service';

export const FlowConversationServiceFactory = (): FlowConversationService => {
  const getResponseByAccountService = GetResponseByAccountServiceFactory();
  const createConversationService = CreateConversationServiceFactory();
  const getConversationTwilio = new GetConversationTwilio();
  const sendMessageWhatsappServiceFactory = SendMessageWhatsappServiceFactory();

  return new FlowConversationService(
    getConversationTwilio,
    createConversationService,
    getResponseByAccountService,
    sendMessageWhatsappServiceFactory,
  );
};
