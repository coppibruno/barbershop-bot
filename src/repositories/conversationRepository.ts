import {PrismaClient, Conversations} from '@prisma/client';
import {ConversationEntity} from '../entity/conversationEntity';
import {OptionsQuery, IRepository} from '../interfaces';
import 'dotenv/config';
const BOT_NUMBER = process.env.BOT_NUMBER;

const prisma = new PrismaClient();

export default class ConversationRepository implements IRepository {
  async create(conversationEntity: ConversationEntity): Promise<Conversations> {
    return prisma.conversations.create({
      data: {
        name: conversationEntity.name || '',
        body: conversationEntity.body,
        messageId: conversationEntity.messageId,
        fromPhone: conversationEntity.fromPhone,
        toPhone: conversationEntity.toPhone,
        accountId: conversationEntity.accountId,
        step: conversationEntity.step,
        state: conversationEntity.state,
        options: conversationEntity.options,
        protocol: conversationEntity.protocol || Date.now(),
      },
    });
  }

  async find(where: OptionsQuery) {
    return await prisma.conversations.findMany({
      ...where,
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(options: OptionsQuery): Promise<Conversations | null> {
    return await prisma.conversations.findFirst({
      ...options,
    });
  }

  async getGroupedByPhone() {
    return prisma.conversations.groupBy({
      by: ['fromPhone', 'protocol', 'step'],
      where: {
        fromPhone: {
          not: Number(BOT_NUMBER),
        },
        state: 'IN_PROGRESS',
      },
      _max: {
        createdAt: true,
      },
      orderBy: {
        step: 'desc',
      },
    });
  }
}
