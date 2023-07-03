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
  async execute(protocol: number): Promise<null | string> {
    const result = await this.findConversationService.findOne({
      where: {
        protocol,
        step: 2,
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
