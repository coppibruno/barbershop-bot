import {StepResponseByOptionMenuFlow} from '../../../services/flow';
import {FindConversationsServiceFactory} from '../find-conversations-service.factory';

export const ResponseByOptionMenuFlowServiceFactory =
  (): StepResponseByOptionMenuFlow => {
    const findConversationsService = FindConversationsServiceFactory();
    return new StepResponseByOptionMenuFlow(findConversationsService);
  };
