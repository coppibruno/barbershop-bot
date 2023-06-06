import {
  StepFindAvaliableDateFlow,
  StepGetDateAndReplyAppointmentFlow,
  StepResponseByOptionMenuFlow,
  StepShowMenuFlow,
  StepWelcomeFlow,
} from './flow';
import {IFlowResult} from '@/interfaces/flow';
import {GetStepConversation} from './get-step-conversation.service';
import {STEP_NOT_IMPLEMETED} from '@/errors';

type IResponseByAccount = {
  [key: number]: string;
};
/**
 * Retorna o resultado do serviço executado
 */
export class GetResponseByAccountService {
  constructor(
    private readonly getStepConversation: GetStepConversation,
    private readonly stepWelcomeFlow: StepWelcomeFlow,
    private readonly stepShowMenuFlow: StepShowMenuFlow,
    private readonly stepResponseByOptionMenuFlow: StepResponseByOptionMenuFlow,
    private readonly stepFindAvaliableDateFlow: StepFindAvaliableDateFlow,
    private readonly stepGetDateAndReplyAppointmentFlow: StepGetDateAndReplyAppointmentFlow,
  ) {}

  async handleStep(accountId: string, step: number): Promise<IFlowResult> {
    if (step === 1) {
      return this.stepWelcomeFlow.execute();
    } else if (step === 2) {
      return this.stepShowMenuFlow.execute(accountId);
    } else if (step === 3) {
      return this.stepResponseByOptionMenuFlow.execute(accountId);
    } else if (step === 4) {
      return this.stepFindAvaliableDateFlow.execute(accountId);
    } else if (step === 5) {
      return this.stepGetDateAndReplyAppointmentFlow.execute(accountId);
    } else {
      throw STEP_NOT_IMPLEMETED;
    }
  }

  async execute(accountId: string): Promise<IFlowResult> {
    type TypeStep = keyof IResponseByAccount;
    const step: TypeStep = await this.getStepConversation.execute(accountId);
    try {
      return await this.handleStep(accountId, step);
    } catch (error) {
      console.error(error);
      return await this.handleStep(accountId, step - 1);
    }
  }
}
