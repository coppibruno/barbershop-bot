import {FlowContext} from '../../flow.context';
import {IFlowResult} from '@/interfaces/flow';
import {GetUserNameConversation} from '@/services/get-user-name.service';
import {GetProtocolByPhoneConversation} from '../get-protocol-by-phone.service';
/**
 * Etapa responsável por mostrar o menu de opções ao usuário
 */
export class StepShowMenuFlow {
  private readonly menu = FlowContext.getMenuUserFormatted();
  constructor(
    private readonly getUserNameConversation: GetUserNameConversation,
    private readonly getProtocolByPhone: GetProtocolByPhoneConversation,
  ) {
    this.getUserNameConversation = getUserNameConversation;
    this.getProtocolByPhone = getProtocolByPhone;
  }

  showMenu(user: string) {
    const menu =
      `${user}, escolha uma das opções a seguir. \n` +
      this.menu.map((item) => `${item} \n`);

    return menu.replaceAll(',', '');
  }

  async getUser(protocol: number): Promise<null | string> {
    return this.getUserNameConversation.execute(protocol);
  }

  async execute(phone: number): Promise<IFlowResult> {
    const protocol = await this.getProtocolByPhone.execute(phone);

    const user = (await this.getUser(protocol)) || '';
    return {response: this.showMenu(user), step: 2};
  }
}
