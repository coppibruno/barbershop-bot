import {faker} from '@faker-js/faker';
import * as FetchStartAndEndAppointment from '../fetch-start-and-end-appointment-time.helper';
import {STEP_NOT_IMPLEMETED} from '../../errors';
const mockedTime = faker.date.future();
const day = mockedTime.getDate();
const month = mockedTime.getMonth() + 1;

jest.doMock('moment', () => {
  const moment = () => ({
    format: () => mockedTime,
    month: () => month,
    hours: () => 23,
    minutes: () => 59,
    seconds: () => 59,
  });

  moment.tz = {
    setDefault: () => {},
  };

  return moment;
});

describe('Fetch Start And End Appointment Time Helper', () => {
  test('should return object with start and end date from appointment', () => {
    const dayMonth = `${day}/${month}`;

    const appointment = '09:00 - 10:00';
    jest
      .spyOn(FetchStartAndEndAppointment, 'isValid')
      .mockReturnValueOnce(true);

    const result =
      FetchStartAndEndAppointment.FetchStartAndEndAppointmentTimeHelper(
        dayMonth,
        appointment,
      );

    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');
  });
  test('should return incorrect param if invalid param is provided', () => {
    const dayMonth = `${day}/${month}`;

    const errorAppointment = '09h-10h';
    expect(() =>
      FetchStartAndEndAppointment.FetchStartAndEndAppointmentTimeHelper(
        dayMonth,
        errorAppointment,
      ),
    ).toThrow(STEP_NOT_IMPLEMETED);

    const errorAppointment2 = '9:00 - 10:00';
    expect(() =>
      FetchStartAndEndAppointment.FetchStartAndEndAppointmentTimeHelper(
        dayMonth,
        errorAppointment2,
      ),
    ).toThrow(STEP_NOT_IMPLEMETED);

    const errorAppointment3 = '09:00_10:00';
    expect(() =>
      FetchStartAndEndAppointment.FetchStartAndEndAppointmentTimeHelper(
        dayMonth,
        errorAppointment3,
      ),
    ).toThrow(STEP_NOT_IMPLEMETED);
  });
});
