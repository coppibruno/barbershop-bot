import {PrismaClient, Meetings} from '@prisma/client';
import {OptionsQuery, IRepository} from '../interfaces';
import {MeetingEntity} from '../entity/meeting.entity';
const prisma = new PrismaClient();

export class MeetingRepository implements IRepository {
  async create(meetingEntity: MeetingEntity): Promise<Meetings> {
    return prisma.meetings.create({
      data: {
        name: meetingEntity.name,
        phone: meetingEntity.phone,
        startDate: meetingEntity.startDate,
        endDate: meetingEntity.endDate,
      },
    });
  }

  async find(where: OptionsQuery) {
    return await prisma.meetings.findMany({
      ...where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(where: OptionsQuery) {
    return await prisma.meetings.findFirst({
      ...where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
