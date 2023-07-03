import {NotFoundError} from '@/errors';
import {FlowContext} from '../flow.context';
import {FindConversationsService} from './find-conversation.service';

/**
 * Busca o protocolo de atendimento
 */
export class GetProtocolByPhoneConversation {
  private readonly findConversationService: FindConversationsService;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }
  async execute(phone: number): Promise<number> {
    const result = await this.findConversationService.findOne({
      where: {
        fromPhone: phone,
        toPhone: Number(FlowContext.BOT_NUMBER),
        state: 'IN_PROGRESS',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!result) {
      throw new NotFoundError('not found conversation to get protocol');
    }

    return result.protocol;
  }
}
