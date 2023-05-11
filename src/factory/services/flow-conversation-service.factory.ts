//external
import {GetConversationTwilio} from '../../external/twilio/get-conversation';

//factories
import {CreateConversationServiceFactory} from './create-conversation-service.factory';
import {GetResponseByAccountServiceFactory} from './get-response-by-account-service.factory';
import {SendMessageWhatsappServiceFactory} from '../integration/send-message-whatsapp-service.factory';

//services
import {FlowConversationService} from '../../services/flow-conversations.service';
import {FindConversationsServiceFactory} from './find-conversations-service.factory';
import {GetUserNameConversationServiceFactory} from './get-user-name-conversations-service.factory';
import {GetLastMessageInProgressServiceFactory} from './get-last-message-in-progress-service.factory';

export const FlowConversationServiceFactory = (): FlowConversationService => {
  const getResponseByAccountService = GetResponseByAccountServiceFactory();
  const createConversationService = CreateConversationServiceFactory();
  const getConversationTwilio = new GetConversationTwilio();
  const sendMessageWhatsappService = SendMessageWhatsappServiceFactory();
  const getUserNameConversationService =
    GetUserNameConversationServiceFactory();
  const getLastMessageInProgressConversationService =
    GetLastMessageInProgressServiceFactory();

  return new FlowConversationService(
    getConversationTwilio,
    createConversationService,
    getResponseByAccountService,
    sendMessageWhatsappService,
    getUserNameConversationService,
    getLastMessageInProgressConversationService,
  );
};
