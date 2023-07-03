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

  async handleStep(phone: number, step: number): Promise<IFlowResult> {
    if (step === 1) {
      return this.stepWelcomeAdminAndShowMenu.execute();
    } else if (step === 2) {
      return this.stepAdminResponseByOptionMenu.execute(phone);
    } else if (step === 3) {
      return this.stepAdminRunOption.execute(phone);
    } else if (step === 4) {
      return this.stepAdminRunOptionPersists.execute(phone);
    } else {
      throw STEP_NOT_IMPLEMETED;
    }
  }

  async execute(phone: number): Promise<IFlowResult> {
    type TypeStep = keyof IResponseByAccount;
    const step: TypeStep = await this.getStepConversation.execute(phone);

    try {
      return await this.handleStep(phone, step);
    } catch (error) {
      console.error(error);
      return await this.handleStep(phone, step - 1);
    }
  }
}
