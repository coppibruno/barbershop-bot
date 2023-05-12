import {GetResponseByAccountService} from '../../services/get-response-by-account.service';
import {
  FindAvaliableDateFlowServiceFactory,
  GetDateAppointmentAndReplyFlowServiceFactory,
  ResponseByOptionMenuFlowServiceFactory,
  ShowMenuFlowServiceFactory,
  WelcomeFlowServiceFactory,
} from './flow';
import {GetStepConversationServiceFactory} from './get-step-conversation-service.factory';

export const GetResponseByAccountServiceFactory =
  (): GetResponseByAccountService => {
    const getStepConversation = GetStepConversationServiceFactory();
    const stepWelcomeFlow = WelcomeFlowServiceFactory();
    const stepShowMenuFlow = ShowMenuFlowServiceFactory();
    const stepResponseByOptionMenuFlow =
      ResponseByOptionMenuFlowServiceFactory();
    const stepFindAvaliableDateFlow = FindAvaliableDateFlowServiceFactory();
    const stepGetDateAppointmentAndReplyFlow =
      GetDateAppointmentAndReplyFlowServiceFactory();

    return new GetResponseByAccountService(
      getStepConversation,
      stepWelcomeFlow,
      stepShowMenuFlow,
      stepResponseByOptionMenuFlow,
      stepFindAvaliableDateFlow,
      stepGetDateAppointmentAndReplyFlow,
    );
  };
