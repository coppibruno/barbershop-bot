import MeetingRepository from '../../../repositories/meetingRepository';
import {StepGetDateAppointmentFlow} from '../../../services/flow/step-05-get-date-appointment.service';
import {FindConversationsServiceFactory} from '../find-conversations-service.factory';
import {FindAvaliableDateServiceFactory} from './step-04-find-avaliable-date-service.factory';

export const GetDateAppointmentServiceFactory = () => {
  const findConversationsService = FindConversationsServiceFactory();
  const stepFindAvaliableDateFlow = FindAvaliableDateServiceFactory();
  const meetingRepository = new MeetingRepository();
  return new StepGetDateAppointmentFlow(
    findConversationsService,
    stepFindAvaliableDateFlow,
    meetingRepository,
  );
};
