import {Conversations} from '@prisma/client';
import {ConversationEntity} from '../../../entity';
import {OptionsQuery} from '../../../interfaces/repositories';
import {FindConversationsService} from '../../find-conversation.service';
import {ConversationRepositoryStub} from './conversation-repository.mock';
import {fakeConversation} from './faker-conversation.mock';

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
