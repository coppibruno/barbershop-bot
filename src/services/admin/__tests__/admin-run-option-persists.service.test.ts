import * as Step from '../admin-run-option-persists.service';
import * as PreviousStep from '../admin-run-option.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  FindMeetingsOfDayServiceStub,
  MeetingRepositoryStub,
  DisableMeetingsOfIntervalServiceStub,
  fakeConversation,
} from '@/__mocks__';
import {faker} from '@faker-js/faker';
import {PadStartDateHelper} from '@/helpers';
import * as ValidateAppointment from '@/helpers/validate-appoitment.helper';
import {FlowContext, typeMenuAdmin} from '@/flow.context';

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const meetingRepositoryStub = new MeetingRepositoryStub();
  const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
    meetingRepositoryStub,
  );

  const disableMeetingsOfIntervalServiceStub =
    new DisableMeetingsOfIntervalServiceStub(meetingRepositoryStub);

  const sut = new Step.AdminRunOptionPersists(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
    disableMeetingsOfIntervalServiceStub,
  );
  return {
    sut,
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
    disableMeetingsOfIntervalServiceStub,
  };
};

jest
  .spyOn(ValidateAppointment, 'AppointmentIsValidHelper')
  .mockReturnValue(true);

jest.spyOn(Step, 'getDay').mockReturnValue('10');
jest.spyOn(Step, 'getMonth').mockReturnValue('06');
jest.spyOn(Step, 'getHours').mockReturnValue('10');
jest.spyOn(Step, 'getMins').mockReturnValue('40');

const phone = 5599999999;

describe('Admin run option persists service', () => {
  test('should call cancelation service and return a good bye message if operation is cancel appointments(MARK OFF MEETINGS)', async () => {
    const {sut, disableMeetingsOfIntervalServiceStub} = makeSut();

    //confirmation cancel appointments
    const spyOn = jest.spyOn(
      Step.AdminRunOptionPersists.prototype as any,
      'getMenuRequest',
    );
    spyOn.mockImplementation(() =>
      Promise.resolve(typeMenuAdmin.MARK_OFF_MEETING),
    );

    //mock user answer data
    jest
      .spyOn(PreviousStep.AdminRunOption.prototype as any, 'userAnswer')
      .mockImplementation(() => Promise.resolve('10/06'));

    const spyServiceExpectedCalled = jest.spyOn(
      disableMeetingsOfIntervalServiceStub,
      'execute',
    );

    const result = await sut.execute(phone);
    expect(spyServiceExpectedCalled).toBeCalled();
    expect(result.response).toEqual(FlowContext.SUCCESSFUL_OPERATION);
    expect(result.step).toBe(4);
  });
  test('should back to menu admin if this option is selected (SHOW_MENU_AGAIN)', async () => {
    const {sut} = makeSut();

    //confirmation cancel appointments
    const spyOn = jest.spyOn(
      Step.AdminRunOptionPersists.prototype as any,
      'getMenuRequest',
    );
    spyOn.mockImplementation(() =>
      Promise.resolve(typeMenuAdmin.SHOW_MENU_AGAIN),
    );

    const result = await sut.execute(phone);
    expect(result.response).toEqual(expect.any(String));
    expect(result.step).toBe(1);
  });
});
