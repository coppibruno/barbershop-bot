//service
import {
  StepFindAvaliableDateFlow,
  StepResponseByOptionMenuFlow,
} from '../../../services/flow';

//factories
import {FindConversationsServiceFactory} from '../find-conversations-service.factory';
import {FindMeetingsOfDayServiceFactory} from '../find-meetings-of-day-service.factory';

export const FindAvaliableDateFlowServiceFactory =
  (): StepFindAvaliableDateFlow => {
    const findConversationsService = FindConversationsServiceFactory();
    const findMeetingsOfDayService = FindMeetingsOfDayServiceFactory();
    const stepResponseByOptionMenuFlow = new StepResponseByOptionMenuFlow(
      findConversationsService,
    );

    return new StepFindAvaliableDateFlow(
      findConversationsService,
      findMeetingsOfDayService,
      stepResponseByOptionMenuFlow,
    );
  };
