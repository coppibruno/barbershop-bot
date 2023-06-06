import {IFlowResult} from '@/interfaces/flow';
import {GetUserNameConversationStub} from '@/__mocks__';
import {StepShowMenuFlow} from '@/services/flow/step-02-show-menu.service';
/**
 * Etapa responsável por mostrar o menu de opções ao usuário
 */
export class StepShowMenuFlowStub extends StepShowMenuFlow {
  private readonly getUserNameConversationStub: GetUserNameConversationStub;

  constructor(getUserNameConversationStub: GetUserNameConversationStub) {
    super(getUserNameConversationStub);
  }

  showMenu(user: string) {
    return 'menu list';
  }

  async getUser(accountId: string): Promise<null | string> {
    return 'fake_user';
  }

  async execute(accountId: string): Promise<IFlowResult> {
    return Promise.resolve({
      response: 'message_step_2',
      step: 2,
    });
  }
}
