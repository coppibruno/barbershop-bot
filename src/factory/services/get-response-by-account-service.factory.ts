import ConversationRepository from '../../repositories/conversationRepository';
import {GetResponseByAccountService} from '../../services/get-response-by-account.service';

export const GetResponseByAccountServiceFactory = () => {
  const conversationRepository = new ConversationRepository();

  return new GetResponseByAccountService(conversationRepository);
};
