import {IFlowResult} from '@/interfaces/flow';
import {GetStepConversation} from '@/services/get-step-conversation.service';
import {STEP_NOT_IMPLEMETED} from '@/errors';
import {
  WelcomeAdminAndShowMenu,
  AdminRunOption,
  AdminRunOptionPersists,
  AdminResponseByOptionMenu,
} from './';

type IResponseByAccount = {
  [key: number]: string;
};
/**
 * Retorna o serviço da etapa executada
 */
export class GetAdminResponseByAccountService {
  constructor(
    private readonly getStepConversation: GetStepConversation,
    private readonly stepWelcomeAdminAndShowMenu: WelcomeAdminAndShowMenu,
    private readonly stepAdminRunOption: AdminRunOption,
    private readonly stepAdminRunOptionPersists: AdminRunOptionPersists,
    private readonly stepAdminResponseByOptionMenu: AdminResponseByOptionMenu,
  ) {}

  async handleStep(accountId: string, step: number): Promise<IFlowResult> {
    if (step === 1) {
      return this.stepWelcomeAdminAndShowMenu.execute();
    } else if (step === 2) {
      return this.stepAdminResponseByOptionMenu.execute(accountId);
    } else if (step === 3) {
      return this.stepAdminRunOption.execute(accountId);
    } else if (step === 4) {
      return this.stepAdminRunOptionPersists.execute(accountId);
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
