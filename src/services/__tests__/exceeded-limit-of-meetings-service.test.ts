import * as Service from '../exceeded-limit-of-meetings.service';
import {MeetingRepositoryStub, fakeMeeting} from '@/__mocks__';

jest
  .spyOn(Service, 'getDateFirstDayOfMonth')
  .mockImplementationOnce(() => '2023-06-01T00:00:00.000Z' as any);
jest
  .spyOn(Service, 'getDateLastDayOfMonth')
  .mockImplementationOnce(() => '2023-06-30T23:59:59.000Z' as any);

const makeSut = () => {
  const meetingRepositoryStub = new MeetingRepositoryStub();

  const sut = new Service.ExceededLimitOfMeetingsService(meetingRepositoryStub);
  return {sut, meetingRepositoryStub};
};

describe('Exceeded limit of meetings service', () => {
  test('should return false if meeting list from account is less than or equal to 4', async () => {
    const {sut} = makeSut();

    const phone = 5599999999;

    const result = await sut.execute(phone);
    expect(result).toBe(false);
  });
  test('should return true if meeting list from account is greater than 4', async () => {
    const {sut, meetingRepositoryStub} = makeSut();

    const phone = 5599999999;

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

    const result = await sut.execute(phone);
    expect(result).toBe(true);
  });
});
