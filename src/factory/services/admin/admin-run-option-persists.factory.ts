import {AdminRunOptionPersists} from '@/services/admin';
import {FindConversationsServiceFactory} from '../find-conversations-service.factory';
import {FindMeetingsOfDayServiceFactory} from '../find-meetings-of-day-service.factory';
import {DisableMeetingsOfIntervalServiceFactory} from '../disable-meetings-of-interval-service.factory';

export const AdminRunOptionPersistsFactory = (): AdminRunOptionPersists => {
  const findConversationService = FindConversationsServiceFactory();
  const findMeetingsOfDayService = FindMeetingsOfDayServiceFactory();
  const disableMeetingsOfIntervalService =
    DisableMeetingsOfIntervalServiceFactory();

  return new AdminRunOptionPersists(
    findConversationService,
    findMeetingsOfDayService,
    disableMeetingsOfIntervalService,
  );
};
