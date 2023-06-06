import {ConversationEntity} from '@/entity/conversation.entity';
import {ConversationRepository} from '@/repositories/conversation.repository';
/**
 * Responsável persistir uma entidade de conversations
 */
export class CreateConversationService {
  private readonly serviceRepository;

  constructor(serviceRepository: ConversationRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(conversationEntity: ConversationEntity) {
    return this.serviceRepository.create(conversationEntity);
  }
}
