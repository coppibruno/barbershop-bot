import {IFlowResult} from '@/interfaces/flow';
import {
  GetProtocolByPhoneConversationStub,
  GetUserNameConversationStub,
} from '@/__mocks__';
import {StepShowMenuFlow} from '@/services/flow/step-02-show-menu.service';
/**
 * Etapa responsável por mostrar o menu de opções ao usuário
 */
export class StepShowMenuFlowStub extends StepShowMenuFlow {
  constructor(
    private readonly getUserNameConversationStub: GetUserNameConversationStub,
    private readonly getProtocolByPhoneStub: GetProtocolByPhoneConversationStub,
  ) {
    super(getUserNameConversationStub, getProtocolByPhoneStub);
  }

  showMenu(user: string) {
    return 'menu list';
  }

  async getUser(phone: number): Promise<null | string> {
    return 'fake_user';
  }

  async execute(phone: number): Promise<IFlowResult> {
    return Promise.resolve({
      response: 'message_step_2',
      step: 2,
    });
  }
}
