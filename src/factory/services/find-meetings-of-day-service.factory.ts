import MeetingRepository from '../../repositories/meetingRepository';
import {FindMeetingsOfDayService} from '../../services/find-meetings-of-day.service';

export const FindMeetingsOfDayServiceFactory = () => {
  const meetingRepository = new MeetingRepository();

  return new FindMeetingsOfDayService(meetingRepository);
};
