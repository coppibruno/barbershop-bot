import {MeetingRepositoryStub} from '../repositories/meeting-repository.mock';
import {DisableMeetingsOfIntervalService} from '@/services/disable-meetings-of-interval.service';

export class DisableMeetingsOfIntervalServiceStub extends DisableMeetingsOfIntervalService {
  constructor(meetingRepository: MeetingRepositoryStub) {
    super(meetingRepository);
  }

  async execute(): Promise<void> {}
}
