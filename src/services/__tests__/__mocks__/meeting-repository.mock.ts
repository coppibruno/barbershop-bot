import {Meetings} from '@prisma/client';
import {MeetingEntity} from '../../../entity';
import {MeetingRepository} from '../../../repositories';
import {fakeMeeting} from './faker-meeting.mock';
import {OptionsQuery} from '../../../interfaces';

export class MeetingRepositoryStub implements MeetingRepository {
  async create(meetingEntity: MeetingEntity): Promise<Meetings> {
    return Promise.resolve(fakeMeeting());
  }

  async find(where: OptionsQuery) {
    return Promise.resolve([fakeMeeting()]);
  }

  async findOne(where: OptionsQuery) {
    return Promise.resolve(fakeMeeting());
  }
}
