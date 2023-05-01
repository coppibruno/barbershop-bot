import {PrismaClient, Conversations} from '@prisma/client';
import {ConversationEntity} from '../entity/conversationEntity';
import {WhereRepository, IRepository} from '../interfaces';
const prisma = new PrismaClient();

export default class ConversationRepository implements IRepository {
  async create(conversationEntity: ConversationEntity): Promise<Conversations> {
    return prisma.conversations.create({
      data: {
        ...(conversationEntity.name ? {name: conversationEntity.name} : {}),
        body: conversationEntity.body,
        messageId: conversationEntity.messageId,
        fromPhone: conversationEntity.fromPhone,
        toPhone: conversationEntity.toPhone,
        accountId: conversationEntity.accountId,
        step: conversationEntity.step,
      },
    });
  }

  async find(where: WhereRepository) {
    return await prisma.conversations.findMany({
      ...where,
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(where: WhereRepository) {
    return await prisma.conversations.findFirst({
      ...where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
