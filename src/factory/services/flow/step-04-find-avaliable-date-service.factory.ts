//service
import {StepFindAvaliableDateFlow} from '../../../services/flow';

//factories
import {FindConversationsServiceFactory} from '../find-conversations-service.factory';
import {FindMeetingsOfDayServiceFactory} from '../find-meetings-of-day-service.factory';

export const FindAvaliableDateFlowServiceFactory =
  (): StepFindAvaliableDateFlow => {
    const findConversationsService = FindConversationsServiceFactory();
    const findMeetingsOfDayService = FindMeetingsOfDayServiceFactory();
    return new StepFindAvaliableDateFlow(
      findConversationsService,
      findMeetingsOfDayService,
    );
  };
