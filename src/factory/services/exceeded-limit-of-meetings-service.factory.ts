import {ExceededLimitOfMeetingsService} from '@/services/exceeded-limit-of-meetings.service';
import {MeetingRepository} from '../../repositories/meeting.repository';

export const ExceededLimitOfMeetingsServiceFactory =
  (): ExceededLimitOfMeetingsService => {
    const meetingRepository = new MeetingRepository();

    return new ExceededLimitOfMeetingsService(meetingRepository);
  };
