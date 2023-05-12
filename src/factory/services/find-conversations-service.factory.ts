import {ConversationRepository} from '../../repositories/conversation.repository';
import {FindConversationsService} from '../../services/find-conversation.service';

export const FindConversationsServiceFactory = (): FindConversationsService => {
  const conversationRepository = new ConversationRepository();

  return new FindConversationsService(conversationRepository);
};
