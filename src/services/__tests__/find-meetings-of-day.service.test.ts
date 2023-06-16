import {faker} from '@faker-js/faker';
import * as Service from '../find-meetings-of-day.service';
import {MeetingRepositoryStub} from '@/__mocks__';
import * as isDezember from '../../helpers/validate-if-is-dezember.helper';
import * as startEndDate from '../../helpers/fetch-start-and-end-appointment-time.helper';
import * as FetchMaxAndMinAppointmentFromDay from '@/helpers/fetch-max-and-min-appointment-from-day.helper';

const mockedDate = faker.date.future();
const day = mockedDate.getDay();
const month = mockedDate.getMonth();
const year = mockedDate.getFullYear();

jest
  .spyOn(isDezember, 'ValidateIfIsDezemberHelper')
  .mockImplementationOnce(() => false);

jest.spyOn(Service, 'getDay').mockImplementationOnce(() => day);
jest.spyOn(Service, 'getMonth').mockImplementationOnce(() => month);
jest.spyOn(Service, 'getYear').mockImplementationOnce(() => year);

jest
  .spyOn(startEndDate, 'FetchStartAndEndAppointmentTimeHelper')
  .mockImplementationOnce(() => ({
    startDate: mockedDate,
    endDate: mockedDate,
  }));

jest
  .spyOn(FetchMaxAndMinAppointmentFromDay, 'FetchMaxAndMinAppointmentFromDay')
  .mockReturnValue({startDate: mockedDate, endDate: mockedDate});

describe('Find Meetings of day Service', () => {
  test('should return a list of meetings of day on success', async () => {
    const meetingRepositoryStub = new MeetingRepositoryStub();

    const create = new Service.FindMeetingsOfDayService(meetingRepositoryStub);

    const spyOn = jest.spyOn(meetingRepositoryStub, 'find');

    const exec = await create.execute(mockedDate as any);

    expect(exec.length).toBe(2);
    expect(spyOn).toBeCalledWith({
      where: {
        startDate: {
          gte: mockedDate.toISOString(),
          lte: mockedDate.toISOString(),
        },
      },
    });
  });
});
