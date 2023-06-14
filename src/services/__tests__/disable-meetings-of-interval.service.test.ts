import {faker} from '@faker-js/faker';
import * as Service from '../disable-meetings-of-interval.service';
import {MeetingRepositoryStub} from '@/__mocks__';

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

    const startDate = faker.date.future();
    const endDate = faker.date.future();

    const spyOn = jest.spyOn(meetingRepositoryStub, 'upsert');

    await sut.execute({startDate, endDate});

    expect(spyOn).toBeCalledWith(
      {
        where: {
          startDate,
          endDate,
        },
      },
      {
        disabledByAdmin: true,
      },
    );
  });
});
