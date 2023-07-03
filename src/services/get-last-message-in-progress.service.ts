import {Conversations} from '@prisma/client';
import {FindConversationsService} from './find-conversation.service';
import {FlowContext} from '@/flow.context';

/**
 * Busca a ultima mensagem e retorna caso não tenha sido finalizada
 */
export class GetLastMessageInProgressConversationService {
  private readonly findConversationService: FindConversationsService;
  public adminNumber = FlowContext.ADMIN_NUMBER;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }
  async execute(phone: number): Promise<Conversations | null> {
    const result = await this.findConversationService.findOne({
      where: {
        fromPhone: Number(this.adminNumber),
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

    return result;
  }
}
