import {FlowContext} from '@/flow.context';
import {IFlowResult} from '@/interfaces/flow';
import {AdminResponseByOptionMenu} from '@/services/admin';
import {FindConversationsServiceStub} from '../find-conversation-service.mock';
import {WelcomeAdminAndShowMenuStub} from './welcome-admin-and-show-menu.mock';
import {InvalidMenuOptionError} from '@/errors';

/**
 * Etapa responsável responder conforme o menu solicitado no WelcomeAdminAndShowMenuService
 */
export class AdminResponseByOptionMenuStub extends AdminResponseByOptionMenu {
  public readonly menu = FlowContext.MENU_ADMIN;

  public msgIncorrectMenuIsProvided = 'menu not found';
  public readonly previousMenuNumber = 1;

  constructor(
    private readonly findConversationServiceStub: FindConversationsServiceStub,
  ) {
    super(findConversationServiceStub);
  }

  public async getMenuRequest(phone: number): Promise<number> {
    return 2;
  }

  public replyMenuRequest(menu: number): string {
    return this.menu.find(({option}) => option === menu).callback;
  }

  async execute(phone: number): Promise<IFlowResult> {
    try {
      const menu = await this.getMenuRequest(phone);

      const response = this.replyMenuRequest(menu);

      return {response, step: 2};
    } catch (error) {
      const {message} = error;

      if (message === this.msgIncorrectMenuIsProvided) {
        return {
          response: InvalidMenuOptionError.INVALID_MENU_OPTION,
          step: this.previousMenuNumber,
        };
      }

      const {response, step} = new WelcomeAdminAndShowMenuStub().execute();

      return {response, step};
    }
  }
}
