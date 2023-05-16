import {faker} from '@faker-js/faker';
import * as FetchStartAndEndAppointment from '../fetch-start-and-end-appointment-time.helper';
import {IncorrectParamIsProvided, InvalidDateError} from '../../errors';
import * as TransformAppointmentInDate from '../transform-appointment-in-date.helper';
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

    const result =
      FetchStartAndEndAppointment.FetchStartAndEndAppointmentTimeHelper(
        dayMonth,
        appointment,
      );

    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');
  });
  test('should return invalid date if invalid param is provided', () => {
    const dayMonth = `${day} - ${month}`;
    const errorAppointment = '09:00 - 10:00';

    jest
      .spyOn(TransformAppointmentInDate, 'getMoment')
      .mockImplementationOnce(() => {
        throw new Error('any error');
      });

    const error1 =
      FetchStartAndEndAppointment.FetchStartAndEndAppointmentTimeHelper(
        dayMonth,
        errorAppointment,
      );

    expect(error1).toBe(
      InvalidDateError.INVALID_DATE || InvalidDateError.INVALID_DATE_DEZEMBER,
    );
  });
  test('should return incorrect param if invalid param is provided', () => {
    const dayMonth = `${day}/${month}`;
    const errorAppointment = '09h-10h';

    const error1 =
      FetchStartAndEndAppointment.FetchStartAndEndAppointmentTimeHelper(
        dayMonth,
        errorAppointment,
      );

    const errorAppointment2 = '9:00 - 10:00';
    const error2 =
      FetchStartAndEndAppointment.FetchStartAndEndAppointmentTimeHelper(
        dayMonth,
        errorAppointment2,
      );
    const errorAppointment3 = '09:00_10:00';

    const error3 =
      FetchStartAndEndAppointment.FetchStartAndEndAppointmentTimeHelper(
        dayMonth,
        errorAppointment3,
      );

    expect(error1).toBeInstanceOf(IncorrectParamIsProvided);
    expect(error2).toBeInstanceOf(IncorrectParamIsProvided);
    expect(error3).toBeInstanceOf(IncorrectParamIsProvided);
  });
});
