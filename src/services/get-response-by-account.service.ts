import 'dotenv/config';
import {
  StepFindAvaliableDateFlow,
  StepResponseByOptionMenuFlow,
  StepShowMenuFlow,
  StepWelcomeFlow,
} from './flow';
import {IFlowResult} from '../interfaces/flow';
import {GetStepConversation} from './get-step-conversation.service';

type IResponseByAccount = {
  [key: number]: string;
};
export class GetResponseByAccountService {
  constructor(
    private readonly getStepConversation: GetStepConversation,
    private readonly stepWelcomeFlow: StepWelcomeFlow,
    private readonly stepShowMenuFlow: StepShowMenuFlow,
    private readonly stepResponseByOptionMenuFlow: StepResponseByOptionMenuFlow,
    private readonly stepFindAvaliableDateFlow: StepFindAvaliableDateFlow,
  ) {}

  async execute(accountId: string): Promise<IFlowResult> {
    type TypeStep = keyof IResponseByAccount;
    const step: TypeStep = await this.getStepConversation.execute(accountId);

    if (step === 1) {
      return this.stepWelcomeFlow.execute();
    } else if (step === 2) {
      return this.stepShowMenuFlow.execute(accountId);
    } else if (step === 3) {
      return this.stepResponseByOptionMenuFlow.execute(accountId);
    } else if (step === 4) {
      return this.stepFindAvaliableDateFlow.execute(accountId);
    } else if (step === 5) {
      return {response: 'method not implemented', step: 999};
    } else {
      return {response: 'method not implemented', step: 999};
    }
  }
}
