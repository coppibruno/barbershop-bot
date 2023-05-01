import {StepFindAvaliableDateFlow} from '../../../services/flow';
import {FindConversationsServiceFactory} from '../find-conversations-service.factory';

export const FindAvaliableDateServiceFactory =
  (): StepFindAvaliableDateFlow => {
    const findConversationsService = FindConversationsServiceFactory();
    return new StepFindAvaliableDateFlow(findConversationsService);
  };
