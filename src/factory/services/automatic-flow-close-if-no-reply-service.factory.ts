import {ConversationRepository} from '../../repositories/conversation.repository';
import {AutomaticFlowCloseIfNoReplyService} from '../../services/automatic-flow-close-if-no-reply.service';
import {SendMessageWhatsappServiceFactory} from '../integration';
import {CreateConversationServiceFactory} from './create-conversation-service.factory';
import {FindConversationsServiceFactory} from './find-conversations-service.factory';

export const AutomaticFlowCloseIfNoReplyServiceFactory =
  (): AutomaticFlowCloseIfNoReplyService => {
    const conversationRepository = new ConversationRepository();
    const createConversationService = CreateConversationServiceFactory();
    const sendMessageWhatsappService = SendMessageWhatsappServiceFactory();
    const findConversationsServiceFactory = FindConversationsServiceFactory();

    return new AutomaticFlowCloseIfNoReplyService(
      conversationRepository,
      createConversationService,
      sendMessageWhatsappService,
      findConversationsServiceFactory,
    );
  };
