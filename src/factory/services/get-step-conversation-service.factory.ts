import {GetStepConversation} from '../../services/get-step-conversation.service';
import {FindConversationsServiceFactory} from './find-conversations-service.factory';

export const GetStepConversationServiceFactory = () => {
  const findConversationsService = FindConversationsServiceFactory();

  return new GetStepConversation(findConversationsService);
};
