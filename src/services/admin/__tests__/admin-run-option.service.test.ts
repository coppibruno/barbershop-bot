import * as Step from '../admin-run-option.service';
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
import {FlowContext} from '@/flow.context';

const accountId = 'faker_account_id';
const mockedTime = faker.date.future();
const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const meetingRepositoryStub = new MeetingRepositoryStub();
  const findMeetingsOfDayServiceStub = new FindMeetingsOfDayServiceStub(
    meetingRepositoryStub,
  );

  const sut = new Step.AdminRunOption(
    findConversationsServiceStub,
    findMeetingsOfDayServiceStub,
  );
  return {sut, findConversationsServiceStub, findMeetingsOfDayServiceStub};
};

jest
  .spyOn(ValidateAppointment, 'AppointmentIsValidHelper')
  .mockReturnValue(true);

jest.spyOn(Step, 'getDay').mockReturnValue(10);
jest.spyOn(Step, 'getMonth').mockReturnValue(6);
jest.spyOn(Step, 'getHours').mockReturnValue(10);
jest.spyOn(Step, 'getMins').mockReturnValue(40);

describe('Admin run option service (SHOW MEETINGS FROM DAY)', () => {
  test('should return a message with list of appointments', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    //fake option 1 (show appointments)
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: '1'})),
      );

    //fake day month selected by user
    const spyOn = jest.spyOn(
      Step.AdminRunOption.prototype as any,
      'userAnswer',
    );
    spyOn.mockImplementation(() => Promise.resolve('10/06'));

    jest
      .spyOn(Step, 'getHoursMin')
      .mockImplementationOnce(
        () =>
          `${PadStartDateHelper(mockedTime.getHours(), 2)}:${PadStartDateHelper(
            mockedTime.getMinutes(),
            2,
          )}`,
      );

    const result = await sut.execute(accountId);
    expect(result.response).toEqual(expect.any(String));
    expect(result.step).toBe(3);
  });
  test('should return a message that does not exist appointments at selected day', async () => {
    const {sut, findConversationsServiceStub, findMeetingsOfDayServiceStub} =
      makeSut();

    //fake option 1 (show appointments)
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: '1'})),
      );

    //fake day month selected by user
    const spyOn = jest.spyOn(
      Step.AdminRunOption.prototype as any,
      'userAnswer',
    );
    spyOn.mockImplementation(() => Promise.resolve('10/06'));

    jest
      .spyOn(findMeetingsOfDayServiceStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve([]));

    const result = await sut.execute(accountId);
    expect(result.response).toEqual(
      'Para o dia 10/06 não há horários marcados',
    );
    expect(result.step).toBe(3);
  });
  test('should call previous step service (2) if error is occurred', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: '1'})),
      );

    const spyOn = jest.spyOn(
      Step.AdminRunOption.prototype as any,
      'getMenuRequest',
    );
    spyOn.mockImplementationOnce(() => {
      throw new Error('any error');
    });

    const result = await sut.execute(accountId);
    const findMenu = FlowContext.MENU_ADMIN.find((i) => i.option === 1);

    expect(result.response).toBe(findMenu.callback);
    expect(result.step).toBe(2);
  });
});

describe('Admin run option service (CANCEL APPOINTMENTS FROM DAY)', () => {
  test('should return a menu with confirmation of cancel operation', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    //fake option 2 (cancel appointments)
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: '2'})),
      );

    //fake day month selected by user
    const spyOn = jest.spyOn(
      Step.AdminRunOption.prototype as any,
      'userAnswer',
    );
    spyOn.mockImplementation(() => Promise.resolve('10/06'));

    const result = await sut.execute(accountId);

    const cancelExpectedMessage = `Você confirma desabilitar o dia 10/06 das 10:40 até 10:40`;

    const menuConfirmation = [
      {
        option: 1,
        label: cancelExpectedMessage,
        step: 3,
      },
      {
        option: 0,
        label: 'Retornar ao menu de admin',
        step: 1,
      },
    ];
    let menuExpected = 'Selecione uma das opções numéricas abaixo: \n';
    menuExpected += menuConfirmation.map(
      (item) => `${item.option} - ${item.label} \n`,
    );
    menuExpected = menuExpected.replaceAll(',', '');

    expect(result.response).toEqual(menuExpected);
    expect(result.step).toBe(3);
  });
  test('(getAppointmentsToDisable) should return a start date and end date if daymonth is provided', async () => {
    const {sut} = makeSut();
    const account_id = 'fake_account_id';

    //mock user answer data
    jest
      .spyOn(Step.AdminRunOption.prototype as any, 'userAnswer')
      .mockImplementation(() => Promise.resolve('10/06'));

    const result = await sut.getAppointmentsToDisable(account_id);

    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');
  });
  test('(getAppointmentsToDisable) should return a start date and end date if daymonth and interval time is provided', async () => {
    const {sut} = makeSut();
    const account_id = 'fake_account_id';

    //mock user answer data
    jest
      .spyOn(Step.AdminRunOption.prototype as any, 'userAnswer')
      .mockImplementation(() => Promise.resolve('10/06 14:00'));

    const result = await sut.getAppointmentsToDisable(account_id);

    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');
  });
  test('(getAppointmentsToDisable) should return a start date and end date if daymonth and interval time with end time is provided', async () => {
    const {sut} = makeSut();
    const account_id = 'fake_account_id';

    //mock user answer data
    jest
      .spyOn(Step.AdminRunOption.prototype as any, 'userAnswer')
      .mockImplementation(() => Promise.resolve('10/06 14:00 - 17:00'));

    const result = await sut.getAppointmentsToDisable(account_id);

    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');
  });
});
