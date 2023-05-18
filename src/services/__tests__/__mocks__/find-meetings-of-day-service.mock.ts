import {Meetings} from '@prisma/client';
import {FindMeetingsOfDayService} from '../../find-meetings-of-day.service';
import {MeetingRepositoryStub} from './meeting-repository.mock';
import {fakeMeeting} from './faker-meeting.mock';

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
