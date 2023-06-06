import {GetUserNameConversation} from '@/services/get-user-name.service';
import {FindConversationsServiceStub} from './find-conversation-service.mock';

export class GetUserNameConversationStub extends GetUserNameConversation {
  constructor(findConversationServiceStub: FindConversationsServiceStub) {
    super(findConversationServiceStub);
  }
  async execute(accountId: string): Promise<string> {
    return Promise.resolve('Any User From Test');
  }
}
