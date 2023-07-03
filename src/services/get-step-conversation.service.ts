import {FlowContext} from '../flow.context';
import {FindConversationsService} from './find-conversation.service';
/**
 * Busca a etapa atual do atendimento
 */
export class GetStepConversation {
  private readonly findConversationService: FindConversationsService;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }
  async execute(phone: number): Promise<number> {
    const conversation = await this.findConversationService.findOne({
      where: {
        fromPhone: Number(FlowContext.BOT_NUMBER),
        toPhone: phone,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let step: number = 0;
    if (conversation) {
      step = conversation.step || 0;

      if (conversation.state === 'FINISHED') {
        step = 0;
      }
    }
    return step + 1;
  }
}
