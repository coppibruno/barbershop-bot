import {GetUserNameConversation} from '../../services/get-user-name.service';
import {FindConversationsServiceFactory} from './find-conversations-service.factory';

export const GetUserNameConversationServiceFactory = () => {
  const findConversationsService = FindConversationsServiceFactory();

  return new GetUserNameConversation(findConversationsService);
};
