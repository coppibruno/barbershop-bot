import {ConversationEntity} from '../entity/conversationEntity';
import ConversationRepository from '../repositories/conversationRepository';
/**
 * Classe responsável por tratar os dados
 */
export class SaveConversationService {
  private readonly serviceRepository;

  constructor(serviceRepository: ConversationRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(conversationEntity: ConversationEntity) {
    return this.serviceRepository.create(conversationEntity);
  }
}
