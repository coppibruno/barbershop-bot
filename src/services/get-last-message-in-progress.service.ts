import {Conversations} from '@prisma/client';
import {FindConversationsService} from './find-conversation.service';

export class GetLastMessageInProgressConversationService {
  private readonly findConversationService: FindConversationsService;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }
  async execute(accountId: string): Promise<Conversations | null> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId,
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
