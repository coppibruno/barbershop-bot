import {StepShowMenuFlow} from '../../../services/flow';
import {GetUserNameConversationServiceFactory} from '../get-user-name-conversations-service.factory';

export const ShowMenuServiceFactory = (): StepShowMenuFlow => {
  const getUserNameConversationService =
    GetUserNameConversationServiceFactory();

  return new StepShowMenuFlow(getUserNameConversationService);
};
