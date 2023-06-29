import * as Service from '../disable-meetings-of-interval.service';
import {MeetingRepositoryStub} from '@/__mocks__';
import {MeetingEntity} from '@/entity';

const makeSut = () => {
  const meetingRepositoryStub = new MeetingRepositoryStub();

  const sut = new Service.DisableMeetingsOfIntervalService(
    meetingRepositoryStub,
  );

  return {sut, meetingRepositoryStub};
};

describe('Disable Meetings of interval', () => {
  test('should call meeting repository method with correct values', async () => {
    const {sut, meetingRepositoryStub} = makeSut();

    const startDate = {toDate: () => {}} as any;
    const endDate = {toDate: () => {}} as any;

    const spyOn = jest.spyOn(meetingRepositoryStub, 'create');

    await sut.execute({startDate, endDate} as any);
    const meetingEntity: MeetingEntity = {
      disabledByAdmin: true,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      name: 'bypass-admin',
      phone: 0,
    };
    expect(spyOn).toBeCalledWith(meetingEntity);
  });
});
