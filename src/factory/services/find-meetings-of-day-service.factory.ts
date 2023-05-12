import {MeetingRepository} from '../../repositories/meeting.repository';
import {FindMeetingsOfDayService} from '../../services/find-meetings-of-day.service';

export const FindMeetingsOfDayServiceFactory = (): FindMeetingsOfDayService => {
  const meetingRepository = new MeetingRepository();

  return new FindMeetingsOfDayService(meetingRepository);
};
