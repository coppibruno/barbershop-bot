//repository
import {GetUserNameConversation} from '@/services';
import {MeetingRepository} from '../../../repositories/meeting.repository';

//service
import {StepGetDateAndReplyAppointmentFlow} from '../../../services/flow/step-05-get-date-appointment-and-reply.service';

//factories
import {FindConversationsServiceFactory} from '../find-conversations-service.factory';
import {FindAvaliableDateFlowServiceFactory} from './step-04-find-avaliable-date-service.factory';
import {SendMessageWhatsappServiceFactory} from '..';
import {GetProtocolByPhoneServiceFactory} from '../get-protocol-by-phone-service.factory';

export const GetDateAppointmentAndReplyFlowServiceFactory =
  (): StepGetDateAndReplyAppointmentFlow => {
    const findConversationsService = FindConversationsServiceFactory();
    const stepFindAvaliableDateFlow = FindAvaliableDateFlowServiceFactory();
    const meetingRepository = new MeetingRepository();

    const getUserNameConversation = new GetUserNameConversation(
      findConversationsService,
    );

    const sendMessageWhatsappService = SendMessageWhatsappServiceFactory();

    const getProtocolByPhoneService = GetProtocolByPhoneServiceFactory();

    return new StepGetDateAndReplyAppointmentFlow(
      findConversationsService,
      stepFindAvaliableDateFlow,
      meetingRepository,
      getUserNameConversation,
      sendMessageWhatsappService,
      getProtocolByPhoneService,
    );
  };
