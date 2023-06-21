import {AdminRunOption} from '@/services/admin';
import {FindConversationsServiceFactory} from '../find-conversations-service.factory';
import {FindMeetingsOfDayServiceFactory} from '../find-meetings-of-day-service.factory';

export const AdminRunOptionFactory = (): AdminRunOption => {
  const findConversationService = FindConversationsServiceFactory();
  const findMeetingsOfDayService = FindMeetingsOfDayServiceFactory();
  return new AdminRunOption(findConversationService, findMeetingsOfDayService);
};
