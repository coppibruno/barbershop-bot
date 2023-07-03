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

  async handleStep(phone: number, step: number): Promise<IFlowResult> {
    if (step === 1) {
      return this.stepWelcomeAdminAndShowMenuStub.execute();
    } else if (step === 2) {
      return this.stepAdminRunOptionStub.execute(phone);
    } else if (step === 3) {
      return this.stepAdminRunOptionPersistsStub.execute(phone);
    } else if (step === 4) {
      return this.stepAdminResponseByOptionMenuStub.execute(phone);
    } else {
      throw STEP_NOT_IMPLEMETED;
    }
  }

  async execute(phone: number): Promise<IFlowResult> {
    const step = await this.getStepConversationStub.execute(phone);
    try {
      return await this.handleStep(phone, step);
    } catch (error) {
      console.error(error);
      return await this.handleStep(phone, step - 1);
    }
  }
}
