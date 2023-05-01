import {FindConversationsService} from './find-conversation.service';
import 'dotenv/config';
const BOT_NUMBER = process.env.BOT_NUMBER;

export class GetStepConversation {
  private readonly findConversationService: FindConversationsService;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }

  async execute(accountId: string): Promise<number> {
    const conversation = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        fromPhone: Number(BOT_NUMBER),
      },
    });
    const step = conversation?.step || 0;
    return step + 1;
  }
}
