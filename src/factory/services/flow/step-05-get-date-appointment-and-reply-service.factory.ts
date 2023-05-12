//repository
import {MeetingRepository} from '../../../repositories/meeting.repository';

//service
import {StepGetDateAndReplyAppointmentFlow} from '../../../services/flow/step-05-get-date-appointment-and-reply.service';

//factories
import {FindConversationsServiceFactory} from '../find-conversations-service.factory';
import {FindAvaliableDateFlowServiceFactory} from './step-04-find-avaliable-date-service.factory';

export const GetDateAppointmentAndReplyFlowServiceFactory =
  (): StepGetDateAndReplyAppointmentFlow => {
    const findConversationsService = FindConversationsServiceFactory();
    const stepFindAvaliableDateFlow = FindAvaliableDateFlowServiceFactory();
    const meetingRepository = new MeetingRepository();

    return new StepGetDateAndReplyAppointmentFlow(
      findConversationsService,
      stepFindAvaliableDateFlow,
      meetingRepository,
    );
  };
