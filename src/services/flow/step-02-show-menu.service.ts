import {FlowContext} from '../../flow.context';
import {IFlowResult} from '../../interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';

export class StepShowMenuFlow {
  private readonly findConversationService: FindConversationsService;
  private readonly menu = FlowContext.MENU;
  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }

  showMenu(user: string) {
    return (
      `${user}, escolha uma das opções a seguir. \n ` +
      this.menu.map((item) => `${item} \n`)
    );
  }

  async getUser(accountId: string): Promise<string> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
      },
    });
    if (!result) {
      throw new Error('Conversation not found to find a user name');
    }
    const name = result.body;
    return name;
  }

  async execute(accountId: string): Promise<IFlowResult> {
    const user = await this.getUser(accountId);
    return {response: this.showMenu(user), step: 2};
  }
}
