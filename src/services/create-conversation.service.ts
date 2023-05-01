import {ConversationEntity} from '../entity/conversationEntity';
import ConversationRepository from '../repositories/conversationRepository';

export class CreateConversationService {
  private readonly serviceRepository;

  constructor(serviceRepository: ConversationRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(conversationEntity: ConversationEntity) {
    return this.serviceRepository.create(conversationEntity);
  }
}
