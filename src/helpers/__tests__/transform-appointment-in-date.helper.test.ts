import {faker} from '@faker-js/faker';
import * as TransformAppointmentInDateHelper from '../transform-appointment-in-date.helper';
import {InvalidDateError} from '../../errors';
const mockedTime = faker.date.future();
const day = mockedTime.getDate();
const month = mockedTime.getMonth() + 1;
jest.doMock('moment', () => {
  const moment = () => ({
    format: () => mockedTime.toISOString(),
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
describe('Transform Appointment In Date Helper', () => {
  test('should return date in valid format', () => {
    const dayMonth = `${day}/${month}`;

    const result =
      TransformAppointmentInDateHelper.TransformAppointmentInDateHelper(
        dayMonth,
      );

    expect(result).not.toBe(InvalidDateError.INVALID_DATE);
    expect(result).not.toBe(InvalidDateError.INVALID_DATE_DEZEMBER);
  });
  test('should return error if is invalid date is provided', () => {
    const dayMonth = `${day}-${month}`;

    jest
      .spyOn(TransformAppointmentInDateHelper, 'getMoment')
      .mockImplementationOnce(() => {
        throw new Error('any error moment');
      });

    const result =
      TransformAppointmentInDateHelper.TransformAppointmentInDateHelper(
        dayMonth,
      );

    expect(result).toBe(
      InvalidDateError.INVALID_DATE || InvalidDateError.INVALID_DATE_DEZEMBER,
    );
  });
});
