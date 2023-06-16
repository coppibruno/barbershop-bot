import {FlowContext} from '../../flow.context';
import {IFlowResult} from '@/interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';
import {WelcomeAdminAndShowMenu} from './welcome-admin-and-show-menu.service';
import {InvalidMenuOptionError, NotFoundError} from '@/errors';
/**
 * Etapa responsável responder conforme o menu solicitado no WelcomeAdminAndShowMenuService
 */
export class AdminResponseByOptionMenu {
  private readonly menu = FlowContext.MENU_ADMIN;

  private readonly findConversationService: FindConversationsService;
  private msgIncorrectMenuIsProvided = 'menu not found';
  private readonly previousMenuNumber = 6;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }

  private async getMenuRequest(accountId: string): Promise<number> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        toPhone: Number(FlowContext.BOT_NUMBER),
        step: 6,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!result) {
      throw new Error('Flow Error get menu');
    }

    return Number(result.body);
  }

  private replyMenuRequest(menu: number): string {
    const menuSelected = this.menu.find(({option}) => option === menu);

    if (!menuSelected) {
      throw new NotFoundError(this.msgIncorrectMenuIsProvided);
    }

    return menuSelected.callback;
  }

  async execute(accountId: string): Promise<IFlowResult> {
    try {
      const menu = await this.getMenuRequest(accountId);

      const response = this.replyMenuRequest(menu);

      return {response, step: 7};
    } catch (error) {
      const {message} = error;

      if (message === this.msgIncorrectMenuIsProvided) {
        return {
          response: InvalidMenuOptionError.INVALID_MENU_OPTION,
          step: this.previousMenuNumber,
        };
      }

      const {response, step} = new WelcomeAdminAndShowMenu().execute();

      return {response, step};
    }
  }
}
