import {Meetings} from '@prisma/client';
import {MeetingEntity} from '@/entity';
import {MeetingRepository} from '@/repositories';
import {fakeMeeting} from '@/__mocks__';
import {OptionsQuery} from '@/interfaces';

export class MeetingRepositoryStub implements MeetingRepository {
  async create(meetingEntity: MeetingEntity): Promise<Meetings> {
    return Promise.resolve(fakeMeeting());
  }

  async find(where: OptionsQuery) {
    return Promise.resolve([fakeMeeting(), fakeMeeting()]);
  }

  async findOne(where: OptionsQuery) {
    return Promise.resolve(fakeMeeting());
  }

  async upsert({where}: OptionsQuery, data: Partial<Meetings>) {
    return Promise.resolve(null);
  }
}
