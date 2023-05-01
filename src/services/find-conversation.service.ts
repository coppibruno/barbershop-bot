import ConversationRepository from '../repositories/conversationRepository';
import {Conversations} from '@prisma/client';

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

  async findOne(options: {
    where: Partial<Conversations>;
  }): Promise<Conversations | null> {
    return this.serviceRepository.findOne({
      where: options.where,
    });
  }
}
