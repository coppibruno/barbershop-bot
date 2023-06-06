import {FlowContext} from '../flow.context';
import {FindConversationsService} from './find-conversation.service';

/**
 * Busca o telefone do usuário
 */
export class GetPhoneByAccountIdConversation {
  private readonly findConversationService: FindConversationsService;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }
  async execute(accountId: string): Promise<null | number> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        toPhone: Number(FlowContext.BOT_NUMBER),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!result) {
      return null;
    }
    const phone = result.fromPhone;

    return phone;
  }
}
