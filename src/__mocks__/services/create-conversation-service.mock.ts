import {ConversationEntity} from '@/entity';
import {CreateConversationService} from '@/services/create-conversation.service';
import {ConversationRepositoryStub} from '../repositories/conversation-repository.mock';

export class CreateConversationServiceStub extends CreateConversationService {
  private readonly serviceRepositoryStub: ConversationRepositoryStub;

  constructor(serviceRepositoryStub: ConversationRepositoryStub) {
    super(serviceRepositoryStub);
  }

  async execute(conversationEntity: ConversationEntity) {
    return Promise.resolve();
  }
}
