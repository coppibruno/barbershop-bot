import {FlowContext} from '../../flow.context';
import {IFlowResult} from '@/interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';
import {WelcomeAdminAndShowMenu} from './welcome-admin-and-show-menu.service';
import {InvalidMenuOptionError, NotFoundError} from '@/errors';
/**
 * Etapa responsável responder conforme o menu solicitado no WelcomeAdminAndShowMenuService
 */
export class AdminResponseByOptionMenu {
  public readonly menu = FlowContext.MENU_ADMIN;

  public readonly findConversationService: FindConversationsService;
  public msgIncorrectMenuIsProvided = 'menu not found';
  public readonly previousMenuNumber = 1;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }

  public async getMenuRequest(phone: number): Promise<number> {
    const result = await this.findConversationService.findOne({
      where: {
        fromPhone: phone,
        toPhone: Number(FlowContext.BOT_NUMBER),
        step: 1,
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

  public replyMenuRequest(menu: number): string {
    const menuSelected = this.menu.find(({option}) => option === menu);

    if (!menuSelected) {
      throw new NotFoundError(this.msgIncorrectMenuIsProvided);
    }

    return menuSelected.callback;
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

      const {response, step} = new WelcomeAdminAndShowMenu().execute();

      return {response, step};
    }
  }
}
