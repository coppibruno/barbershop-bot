import {GetResponseByAccountService} from '../../services/get-response-by-account.service';
import {
  FindAvaliableDateServiceFactory,
  ResponseByOptionMenuServiceFactory,
  ShowMenuServiceFactory,
  WelcomeFlowServiceFactory,
} from './flow';
import {GetStepConversationServiceFactory} from './get-step-conversation-service.factory';

export const GetResponseByAccountServiceFactory = () => {
  const getStepConversation = GetStepConversationServiceFactory();
  const stepWelcomeFlow = WelcomeFlowServiceFactory();
  const stepShowMenuFlow = ShowMenuServiceFactory();
  const stepResponseByOptionMenuFlow = ResponseByOptionMenuServiceFactory();
  const stepFindAvaliableDateFlow = FindAvaliableDateServiceFactory();

  return new GetResponseByAccountService(
    getStepConversation,
    stepWelcomeFlow,
    stepShowMenuFlow,
    stepResponseByOptionMenuFlow,
    stepFindAvaliableDateFlow,
  );
};
