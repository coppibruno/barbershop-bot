import {IFlowResult} from '@/interfaces';
import {GetResponseByAccountService} from '@/services/get-response-by-account.service';
import {GetStepConversationStub} from '.';
import {
  StepFindAvaliableDateFlowStub,
  StepGetDateAndReplyAppointmentFlowStub,
  StepResponseByOptionMenuFlowStub,
  StepShowMenuFlowStub,
  StepWelcomeFlowStub,
} from '@/__mocks__';

export class GetResponseByAccountServiceStub extends GetResponseByAccountService {
  constructor(
    private readonly getStepConversationStub: GetStepConversationStub,
    private readonly stepWelcomeFlowStub: StepWelcomeFlowStub,
    private readonly stepShowMenuFlowStub: StepShowMenuFlowStub,
    private readonly stepResponseByOptionMenuFlowStub: StepResponseByOptionMenuFlowStub,
    private readonly stepFindAvaliableDateFlowStub: StepFindAvaliableDateFlowStub,
    private readonly stepGetDateAndReplyAppointmentFlowStub: StepGetDateAndReplyAppointmentFlowStub,
  ) {
    super(
      getStepConversationStub,
      stepWelcomeFlowStub,
      stepShowMenuFlowStub,
      stepResponseByOptionMenuFlowStub,
      stepFindAvaliableDateFlowStub,
      stepGetDateAndReplyAppointmentFlowStub,
    );
  }

  async handleStep(phone: number, step: number): Promise<IFlowResult> {
    return Promise.resolve({
      response: 'any_response',
      step: 1,
    });
  }

  async execute(phone: number): Promise<IFlowResult> {
    return Promise.resolve({
      response: 'any_response',
      step: 1,
    });
  }
}
