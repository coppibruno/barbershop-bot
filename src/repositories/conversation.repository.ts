import {PrismaClient, Conversations} from '@prisma/client';
import {ConversationEntity} from '@/entity/conversation.entity';
import {OptionsQuery, IRepository} from '@/interfaces';
import {FlowContext} from '../flow.context';

const prisma = new PrismaClient();

export class ConversationRepository implements IRepository {
  async create(conversationEntity: ConversationEntity): Promise<Conversations> {
    return prisma.conversations.create({
      data: {
        name: conversationEntity.name || '',
        body: conversationEntity.body,
        messageId: conversationEntity.messageId,
        fromPhone: conversationEntity.fromPhone,
        toPhone: conversationEntity.toPhone,
        accountId: conversationEntity.accountId,
        step: conversationEntity.step || 1,
        state: conversationEntity.state,
        options: conversationEntity.options,
        protocol: conversationEntity.protocol || Date.now(),
      },
    });
  }

  async find(where: OptionsQuery): Promise<Conversations[]> {
    return await prisma.conversations.findMany({
      ...where,
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(options: OptionsQuery): Promise<Conversations> {
    return await prisma.conversations.findFirst({
      ...options,
    });
  }

  async getGroupedByPhone(): Promise<any> {
    return prisma.conversations.groupBy({
      by: ['fromPhone', 'protocol'],
      where: {
        fromPhone: {
          not: Number(FlowContext.BOT_NUMBER),
        },
        state: 'IN_PROGRESS',
      },
      _max: {
        createdAt: true,
      },
    });
  }

  async updateState({
    fromPhone,
    state = 'FINISHED',
  }: Partial<Conversations>): Promise<any> {
    return prisma.conversations.updateMany({
      where: {
        fromPhone,
      },
      data: {
        state,
      },
    });
  }
}
