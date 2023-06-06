import {FlowContext} from '../../flow.context';
import {IFlowResult} from '@/interfaces/flow';
import {GetUserNameConversation} from '@/services/get-user-name.service';
/**
 * Etapa responsável por mostrar o menu de opções ao usuário
 */
export class StepShowMenuFlow {
  private readonly getUserNameConversation: GetUserNameConversation;

  private readonly menu = FlowContext.MENU;
  constructor(getUserNameConversation: GetUserNameConversation) {
    this.getUserNameConversation = getUserNameConversation;
  }

  showMenu(user: string) {
    const menu =
      `${user}, escolha uma das opções a seguir. \n` +
      this.menu.map((item) => `${item} \n`);

    return menu.replaceAll(',', '');
  }

  async getUser(accountId: string): Promise<null | string> {
    return this.getUserNameConversation.execute(accountId);
  }

  async execute(accountId: string): Promise<IFlowResult> {
    const user = (await this.getUser(accountId)) || '';
    return {response: this.showMenu(user), step: 2};
  }
}
