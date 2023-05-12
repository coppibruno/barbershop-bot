import {ConversationRepository} from '../../repositories/conversation.repository';
import {CreateConversationService} from '../../services/create-conversation.service';

export const CreateConversationServiceFactory =
  (): CreateConversationService => {
    const conversationRepository = new ConversationRepository();

    return new CreateConversationService(conversationRepository);
  };
