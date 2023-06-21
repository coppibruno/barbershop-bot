import {MeetingRepositoryStub} from '../repositories/meeting-repository.mock';
import {
  DisableMeetingsOfIntervalService,
  IStartAndEndDate,
} from '@/services/disable-meetings-of-interval.service';

export class DisableMeetingsOfIntervalServiceStub extends DisableMeetingsOfIntervalService {
  constructor(private readonly meetingRepositoryStub: MeetingRepositoryStub) {
    super(meetingRepositoryStub);
  }

  async execute({startDate, endDate}: IStartAndEndDate): Promise<void> {
    return this.meetingRepositoryStub.upsert(
      {
        where: {
          startDate,
          endDate,
        },
      },
      {
        disabledByAdmin: true,
      },
    );
  }
}
