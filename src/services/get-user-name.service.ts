import {FlowContext} from '../flow.context';
import {FindConversationsService} from './find-conversation.service';

/**
 * Busca o nome do usuário
 */
export class GetUserNameConversation {
  private readonly findConversationService: FindConversationsService;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }
  async execute(accountId: string): Promise<null | string> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        step: 1,
        toPhone: Number(FlowContext.BOT_NUMBER),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!result) {
      return null;
    }
    const name = result.body;

    return name;
  }
}
