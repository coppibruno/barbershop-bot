import {FlowContext} from '../../flow.context';
import {IFlowResult} from '@/interfaces/flow';
/**
 * Etapa responsável por dar boas vindas ao admin e mostrar o menu de ações
 */
export class WelcomeAdminAndShowMenu {
  private readonly menu = FlowContext.MENU_ADMIN;
  private readonly welcome = FlowContext.ADMIN_WELCOME;

  execute(): IFlowResult {
    let response =
      `${this.welcome} \n` + this.menu.map(({label}) => `${label} \n`);

    response = response.replaceAll(',', '');

    return {response, step: 6};
  }
}
