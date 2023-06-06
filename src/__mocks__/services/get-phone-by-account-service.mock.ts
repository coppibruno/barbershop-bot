import {GetPhoneByAccountIdConversation} from '@/services/get-phone-by-account.service';
import {FindConversationsServiceStub} from './find-conversation-service.mock';

export class GetPhoneByAccountStub extends GetPhoneByAccountIdConversation {
  constructor(findConversationServiceStub: FindConversationsServiceStub) {
    super(findConversationServiceStub);
  }
  async execute(accountId: string): Promise<number> {
    return Promise.resolve(999999);
  }
}
