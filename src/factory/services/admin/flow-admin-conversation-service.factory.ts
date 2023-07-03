//external
import {GetConversationTwilio} from '@/external/twilio/get-conversation';

//factories
import {CreateConversationServiceFactory} from '../create-conversation-service.factory';

//services
import {
  SendMessageWhatsappServiceFactory,
  GetLastMessageInProgressServiceFactory,
} from '../';
import {FlowAdminConversationService} from '@/services/admin';
import {GetAdminResponseByAccountServiceFactory} from '.';
import {ConversationRepository} from '@/repositories';

export const FlowAdminConversationServiceFactory =
  (): FlowAdminConversationService => {
    const getAdminResponseByAccountService =
      GetAdminResponseByAccountServiceFactory();
    const createConversationService = CreateConversationServiceFactory();
    const getConversationTwilio = new GetConversationTwilio();
    const sendMessageWhatsappService = SendMessageWhatsappServiceFactory();
    const getLastMessageInProgressConversationService =
      GetLastMessageInProgressServiceFactory();
    const conversationRepository = new ConversationRepository();

    return new FlowAdminConversationService(
      getConversationTwilio,
      createConversationService,
      getAdminResponseByAccountService,
      sendMessageWhatsappService,
      getLastMessageInProgressConversationService,
      conversationRepository,
    );
  };
