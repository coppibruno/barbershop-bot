import {FindConversationsServiceStub} from './find-conversation-service.mock';
import {GetProtocolByPhoneConversation} from '@/services';

export class GetProtocolByPhoneConversationStub extends GetProtocolByPhoneConversation {
  constructor(findConversationServiceStub: FindConversationsServiceStub) {
    super(findConversationServiceStub);
  }
  async execute(phone: number): Promise<number> {
    return Promise.resolve(99999999999);
  }
}
