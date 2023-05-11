import {GetResponseByAccountService} from '../../services/get-response-by-account.service';
import {
  FindAvaliableDateServiceFactory,
  GetDateAppointmentServiceFactory,
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
  const stepGetDateAppointmentFlow = GetDateAppointmentServiceFactory();

  return new GetResponseByAccountService(
    getStepConversation,
    stepWelcomeFlow,
    stepShowMenuFlow,
    stepResponseByOptionMenuFlow,
    stepFindAvaliableDateFlow,
    stepGetDateAppointmentFlow,
  );
};
