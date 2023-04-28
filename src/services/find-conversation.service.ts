import {ConversationEntity} from '../entity/conversation';
import {WhereRepository} from '../interfaces/repositories';
import ConversationRepository from '../repositories/conversationRepository';
import {Conversations} from '@prisma/client';

export class FindConversationsService {
  private readonly serviceRepository;

  constructor(serviceRepository: ConversationRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(options: {where: any}): Promise<Conversations[]> {
    return this.serviceRepository.find({
      where: options.where,
    });
  }
}
