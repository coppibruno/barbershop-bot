import {StepShowMenuFlow} from '../../../services/flow';
import {GetProtocolByPhoneServiceFactory} from '../get-protocol-by-phone-service.factory';
import {GetUserNameConversationServiceFactory} from '../get-user-name-conversations-service.factory';

export const ShowMenuFlowServiceFactory = (): StepShowMenuFlow => {
  const getUserNameConversationService =
    GetUserNameConversationServiceFactory();

  const getProtocolByPhoneService = GetProtocolByPhoneServiceFactory();

  return new StepShowMenuFlow(
    getUserNameConversationService,
    getProtocolByPhoneService,
  );
};
