import {OptionsQuery} from '@/interfaces/repositories';
import {FindConversationsService} from '@/services/find-conversation.service';
import {ConversationRepositoryStub} from '../repositories/conversation-repository.mock';
import {fakeConversation} from '../entities/faker-conversation.mock';

export class FindConversationsServiceStub extends FindConversationsService {
  constructor(serviceRepositoryStub: ConversationRepositoryStub) {
    super(serviceRepositoryStub);
  }

  async execute(): Promise<any> {
    return Promise.resolve();
  }
  async findOne(
    options: OptionsQuery = {orderBy: {createdAt: 'desc'}},
  ): Promise<any> {
    return Promise.resolve(fakeConversation());
  }
}
