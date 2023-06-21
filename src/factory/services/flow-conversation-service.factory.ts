//external
import {GetConversationTwilio} from '../../external/twilio/get-conversation';

//factories
import {CreateConversationServiceFactory} from './create-conversation-service.factory';
import {GetResponseByAccountServiceFactory} from './get-response-by-account-service.factory';
import {SendMessageWhatsappServiceFactory} from '../integration/send-message-whatsapp-service.factory';

//services
import {FlowConversationService} from '../../services/flow-conversations.service';
import {GetUserNameConversationServiceFactory} from './get-user-name-conversations-service.factory';
import {GetLastMessageInProgressServiceFactory} from './get-last-message-in-progress-service.factory';

//admin service
import {FlowAdminConversationServiceFactory} from './admin/flow-admin-conversation-service.factory';
import {ExceededLimitOfMeetingsServiceFactory} from './exceeded-limit-of-meetings-service.factory';

export const FlowConversationServiceFactory = (): FlowConversationService => {
  const getResponseByAccountService = GetResponseByAccountServiceFactory();
  const createConversationService = CreateConversationServiceFactory();
  const getConversationTwilio = new GetConversationTwilio();
  const sendMessageWhatsappService = SendMessageWhatsappServiceFactory();
  const getUserNameConversationService =
    GetUserNameConversationServiceFactory();
  const getLastMessageInProgressConversationService =
    GetLastMessageInProgressServiceFactory();
  const flowAdminConversationService = FlowAdminConversationServiceFactory();
  const exceededLimitOfMeetingsServiceFactory =
    ExceededLimitOfMeetingsServiceFactory();

  return new FlowConversationService(
    getConversationTwilio,
    createConversationService,
    getResponseByAccountService,
    sendMessageWhatsappService,
    getUserNameConversationService,
    getLastMessageInProgressConversationService,
    flowAdminConversationService,
    exceededLimitOfMeetingsServiceFactory,
  );
};
