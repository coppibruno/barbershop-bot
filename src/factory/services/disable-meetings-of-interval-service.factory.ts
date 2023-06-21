import {DisableMeetingsOfIntervalService} from '@/services/disable-meetings-of-interval.service';
import {MeetingRepository} from '../../repositories/meeting.repository';

export const DisableMeetingsOfIntervalServiceFactory =
  (): DisableMeetingsOfIntervalService => {
    const meetingRepository = new MeetingRepository();

    return new DisableMeetingsOfIntervalService(meetingRepository);
  };
