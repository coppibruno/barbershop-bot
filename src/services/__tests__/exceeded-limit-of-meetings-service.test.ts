import * as Service from '../exceeded-limit-of-meetings.service';
import {
  MeetingRepositoryStub,
  GetPhoneByAccountStub,
  FindConversationsServiceStub,
  ConversationRepositoryStub,
  fakeMeeting,
} from '@/__mocks__';

jest
  .spyOn(Service, 'getDateFirstDayOfMonth')
  .mockImplementationOnce(() => '2023-06-01T00:00:00.000Z' as any);
jest
  .spyOn(Service, 'getDateLastDayOfMonth')
  .mockImplementationOnce(() => '2023-06-30T23:59:59.000Z' as any);

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const meetingRepositoryStub = new MeetingRepositoryStub();

  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );
  const getPhoneByAccountStub = new GetPhoneByAccountStub(
    findConversationsServiceStub,
  );

  const sut = new Service.ExceededLimitOfMeetingsService(
    meetingRepositoryStub,
    getPhoneByAccountStub,
  );
  return {sut, getPhoneByAccountStub, meetingRepositoryStub};
};

describe('Exceeded limit of meetings service', () => {
  test('should return false if meeting list from account is less than or equal to 4', async () => {
    const {sut} = makeSut();

    const accountId = 'fake_account_id';

    const result = await sut.execute(accountId);
    expect(result).toBe(false);
  });
  test('should return true if meeting list from account is greater than 4', async () => {
    const {sut, meetingRepositoryStub} = makeSut();

    const accountId = 'fake_account_id';

    jest
      .spyOn(meetingRepositoryStub, 'find')
      .mockImplementationOnce(() =>
        Promise.resolve([
          fakeMeeting(),
          fakeMeeting(),
          fakeMeeting(),
          fakeMeeting(),
        ]),
      );

    const result = await sut.execute(accountId);
    expect(result).toBe(true);
  });
});
