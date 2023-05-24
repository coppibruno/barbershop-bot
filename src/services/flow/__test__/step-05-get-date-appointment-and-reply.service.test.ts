import * as Step from '../step-05-get-date-appointment-and-reply.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  FindMeetingsOfDayServiceStub,
  MeetingRepositoryStub,
  StepFindAvaliableDateServiceStub,
  fakeConversation,
} from '../../__tests__/__mocks__/';
import {InvalidMenuOptionError} from '../../../errors';

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();

  const meetingRepositoryStub = new MeetingRepositoryStub();

  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );
  const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
    meetingRepositoryStub,
  );
  const stepFindAvaliableDateFlowStub = new StepFindAvaliableDateServiceStub(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
  );

  const sut = new Step.StepGetDateAndReplyAppointmentFlow(
    findConversationsServiceStub,
    stepFindAvaliableDateFlowStub,
    meetingRepositoryStub,
  );

  return {
    sut,
    findConversationsServiceStub,
    stepFindAvaliableDateFlowStub,
    meetingRepositoryStub,
  };
};

describe('Step Get Date Appointment And Reply', () => {
  test('should return message to schedule an appointment and step 3', async () => {
    const {sut} = makeSut();
  });
});
