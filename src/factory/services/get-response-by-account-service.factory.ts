import ConversationRepository from '../../repositories/conversationRepository';
import {GetResponseByAccountService} from '../../services/get-response-by-account.service';
import {FindConversationsServiceFactory} from './find-conversations-service.factory';

export const GetResponseByAccountServiceFactory = () => {
  const conversationRepository = new ConversationRepository();
  const findConversationService = FindConversationsServiceFactory();

  return new GetResponseByAccountService(
    conversationRepository,
    findConversationService,
  );
};
