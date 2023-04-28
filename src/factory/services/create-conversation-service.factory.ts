import ConversationRepository from '../../repositories/conversationRepository';
import {CreateConversationService} from '../../services/create-conversation.service';

export const CreateConversationServiceFactory = () => {
  const conversationRepository = new ConversationRepository();

  return new CreateConversationService(conversationRepository);
};
