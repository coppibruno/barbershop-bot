import {Conversations} from '@prisma/client';
import {ConversationEntity} from '../../../entity';
import {ConversationRepository} from '../../../repositories';
import {fakeConversation} from './faker-conversation.mock';
import {OptionsQuery} from '../../../interfaces';

export class ConversationRepositoryStub implements ConversationRepository {
  async create(conversationEntity: ConversationEntity): Promise<Conversations> {
    return Promise.resolve(fakeConversation());
  }

  async find(where: OptionsQuery) {
    return Promise.resolve([fakeConversation(), fakeConversation()]);
  }

  async findOne(options: OptionsQuery): Promise<Conversations> {
    return Promise.resolve(fakeConversation());
  }

  async getGroupedByPhone() {
    return Promise.resolve(null);
  }
}
