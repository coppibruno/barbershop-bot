import {IFlowResult} from '@/interfaces/flow';
import {WelcomeAdminAndShowMenu} from '@/services/admin';
/**
 * Etapa responsável por dar boas vindas ao administrador e mostrar o menu
 */
export class WelcomeAdminAndShowMenuStub extends WelcomeAdminAndShowMenu {
  execute(): IFlowResult {
    return {response: 'message_step_1', step: 1};
  }
}
