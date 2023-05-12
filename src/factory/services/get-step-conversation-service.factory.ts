import {GetStepConversation} from '../../services/get-step-conversation.service';
import {FindConversationsServiceFactory} from './find-conversations-service.factory';

export const GetStepConversationServiceFactory = (): GetStepConversation => {
  const findConversationsService = FindConversationsServiceFactory();

  return new GetStepConversation(findConversationsService);
};
