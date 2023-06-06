import {GetStepConversation} from '@/services/get-step-conversation.service';
import {FindConversationsServiceStub} from './find-conversation-service.mock';

export class GetStepConversationStub extends GetStepConversation {
  private readonly findConversationServiceStub: FindConversationsServiceStub;

  constructor(findConversationServiceStub: FindConversationsServiceStub) {
    super(findConversationServiceStub);
  }
  async execute(accountId: string): Promise<number> {
    return Promise.resolve(1);
  }
}
