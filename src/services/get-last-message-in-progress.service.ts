import {Conversations} from '@prisma/client';
import {FindConversationsService} from './find-conversation.service';
import {FlowContext} from '@/flow.context';

/**
 * Busca a ultima mensagem e retorna caso não tenha sido finalizada
 */
export class GetLastMessageInProgressConversationService {
  private readonly findConversationService: FindConversationsService;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }
  async execute(phone: number): Promise<Conversations | null> {
    const result = await this.findConversationService.findOne({
      where: {
        fromPhone: Number(FlowContext.BOT_NUMBER),
        toPhone: phone,
        state: 'IN_PROGRESS',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!result) {
      return null;
    }

    if (result.state === 'FINISHED') {
      return null;
    }

    return result;
  }
}
