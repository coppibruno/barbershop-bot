import ConversationRepository from '../../repositories/conversationRepository';
import {FindConversationsService} from '../../services/find-conversation.service';

export const FindConversationsServiceFactory = () => {
  const conversationRepository = new ConversationRepository();

  return new FindConversationsService(conversationRepository);
};
