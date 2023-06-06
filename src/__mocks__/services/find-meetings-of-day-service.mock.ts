import {Meetings} from '@prisma/client';
import {FindMeetingsOfDayService} from '@/services/find-meetings-of-day.service';
import {MeetingRepositoryStub} from '../repositories/meeting-repository.mock';
import {fakeMeeting} from '../entities/faker-meeting.mock';

export class FindMeetingsOfDayServiceStub extends FindMeetingsOfDayService {
  constructor(serviceRepositoryStub: MeetingRepositoryStub) {
    super(serviceRepositoryStub);
  }

  async execute(): Promise<Meetings[]> {
    return Promise.resolve([
      fakeMeeting(),
      fakeMeeting(),
      fakeMeeting(),
      fakeMeeting(),
      fakeMeeting(),
    ]);
  }
}
