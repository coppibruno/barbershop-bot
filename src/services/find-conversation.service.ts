import {OptionsQuery} from '../interfaces/repositories';
import {ConversationRepository} from '../repositories/conversation.repository';
import {Conversations} from '@prisma/client';

/**
 * Busca uma ou várias Conversations no banco
 */
export class FindConversationsService {
  private readonly serviceRepository;

  constructor(serviceRepository: ConversationRepository) {
    this.serviceRepository = serviceRepository;
  }

  async find(options: {
    where: Partial<Conversations>;
  }): Promise<Conversations[]> {
    return this.serviceRepository.find({
      where: options.where,
    });
  }

  async findOne(
    options: OptionsQuery = {orderBy: {createdAt: 'desc'}},
  ): Promise<Conversations> {
    return this.serviceRepository.findOne({
      ...options,
    });
  }
}
