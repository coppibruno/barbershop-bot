//external
import {GetConversationTwilio} from '../../external/twilio/get-conversation';

//factories
import {CreateConversationServiceFactory} from './create-conversation-service.factory';
import {GetResponseByAccountServiceFactory} from './get-response-by-account-service.factory';
import {SendMessageWhatsappServiceFactory} from './send-message-whatsapp-service.factory';

//services
import {FlowConversationService} from '../../services/flow-conversations.service';
import ConversationRepository from '../../repositories/conversationRepository';
import {FindConversationsService} from '../../services/find-conversation.service';

export const FlowConversationServiceFactory = (): FlowConversationService => {
  const conversationRepository = new ConversationRepository();
  const findConversationsService = new FindConversationsService(
    conversationRepository,
  );

  const getResponseByAccountService = GetResponseByAccountServiceFactory();
  const createConversationService = CreateConversationServiceFactory();
  const getConversationTwilio = new GetConversationTwilio(
    findConversationsService,
  );
  const sendMessageWhatsappServiceFactory = SendMessageWhatsappServiceFactory();

  return new FlowConversationService(
    getConversationTwilio,
    createConversationService,
    getResponseByAccountService,
    sendMessageWhatsappServiceFactory,
  );
};
