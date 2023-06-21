import {IFlowResult} from '@/interfaces';
import {
  AdminResponseByOptionMenuStub,
  AdminRunOptionPersistsStub,
  AdminRunOptionStub,
  WelcomeAdminAndShowMenuStub,
} from '.';
import {GetStepConversationStub} from '@/__mocks__';
import {GetAdminResponseByAccountService} from '@/services/admin';
import {STEP_NOT_IMPLEMETED} from '@/errors';

export class GetAdminResponseByAccountServiceStub extends GetAdminResponseByAccountService {
  constructor(
    private readonly getStepConversationStub: GetStepConversationStub,
    private readonly stepWelcomeAdminAndShowMenuStub: WelcomeAdminAndShowMenuStub,
    private readonly stepAdminRunOptionStub: AdminRunOptionStub,
    private readonly stepAdminRunOptionPersistsStub: AdminRunOptionPersistsStub,
    private readonly stepAdminResponseByOptionMenuStub: AdminResponseByOptionMenuStub,
  ) {
    super(
      getStepConversationStub,
      stepWelcomeAdminAndShowMenuStub,
      stepAdminRunOptionStub,
      stepAdminRunOptionPersistsStub,
      stepAdminResponseByOptionMenuStub,
    );
  }

  async handleStep(accountId: string, step: number): Promise<IFlowResult> {
    if (step === 1) {
      return this.stepWelcomeAdminAndShowMenuStub.execute();
    } else if (step === 2) {
      return this.stepAdminRunOptionStub.execute(accountId);
    } else if (step === 3) {
      return this.stepAdminRunOptionPersistsStub.execute(accountId);
    } else if (step === 4) {
      return this.stepAdminResponseByOptionMenuStub.execute(accountId);
    } else {
      throw STEP_NOT_IMPLEMETED;
    }
  }

  async execute(accountId: string): Promise<IFlowResult> {
    const step = await this.getStepConversationStub.execute(accountId);
    try {
      return await this.handleStep(accountId, step);
    } catch (error) {
      console.error(error);
      return await this.handleStep(accountId, step - 1);
    }
  }
}
