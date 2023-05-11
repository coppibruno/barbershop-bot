import {OptionsQuery} from '../interfaces/repositories';
import ConversationRepository from '../repositories/conversationRepository';
import {Conversations} from '@prisma/client';

type Options = {
  where?: Partial<Conversations>;
  orderBy?: any;
};

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
  ): Promise<Conversations | null> {
    return this.serviceRepository.findOne({
      ...options,
    });
  }
}
