import {GetResponseByAccountService} from '../../services/get-response-by-account.service';
import {FindConversationsServiceFactory} from './find-conversations-service.factory';

export const GetResponseByAccountServiceFactory = () => {
  const findConversationService = FindConversationsServiceFactory();

  return new GetResponseByAccountService(findConversationService);
};
