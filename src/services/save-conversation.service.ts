import {ConversationEntity} from '../entity/conversation';
import IRepository from '../interfaces/repositories';
/**
 * Classe responsável por tratar os dados
 */
export class SaveConversationService {
  private readonly serviceRepository;

  constructor(serviceRepository: IRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(conversationEntity: ConversationEntity) {
    return this.serviceRepository.create(conversationEntity);
  }
}
