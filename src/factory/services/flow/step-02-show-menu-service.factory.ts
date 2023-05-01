import {StepShowMenuFlow} from '../../../services/flow';
import {FindConversationsServiceFactory} from '../find-conversations-service.factory';

export const ShowMenuServiceFactory = (): StepShowMenuFlow => {
  const findConversationsService = FindConversationsServiceFactory();
  return new StepShowMenuFlow(findConversationsService);
};
