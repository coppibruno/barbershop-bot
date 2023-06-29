import {InvalidDateError} from '../../errors';
import * as ValidateAppointmentHelper from '../validate-appoitment.helper';
import {faker} from '@faker-js/faker';
import * as ValidateIfIsDezember from '../validate-if-is-dezember.helper';

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

jest
  .spyOn(ValidateIfIsDezember, 'ValidateIfIsDezemberHelper')
  .mockReturnValue(false);

jest.spyOn(ValidateAppointmentHelper, 'isBefore').mockReturnValue(false);

jest.spyOn(ValidateAppointmentHelper, 'isSunday').mockReturnValue(false);

jest.spyOn(ValidateAppointmentHelper, 'isMonday').mockReturnValue(false);

jest.spyOn(ValidateAppointmentHelper, 'isOpenMonday').mockReturnValue(false);

describe('Appointment Is Valid Helper', () => {
  test('should return true with a valid format', () => {
    const validFormat = `${day}/${month}`;
    const expectedValid =
      ValidateAppointmentHelper.AppointmentIsValidHelper(validFormat);

    expect(expectedValid).toBe(true);
  });

  test('should return error if date is past date', () => {
    jest.spyOn(ValidateAppointmentHelper, 'isBefore').mockReturnValueOnce(true);

    const validFormat = `${day}/${month}`;
    const expectedError =
      ValidateAppointmentHelper.AppointmentIsValidHelper(validFormat);
    expect(expectedError).toBe(InvalidDateError.INVALID_DATE);
  });

  test('should return error if day is sunday', () => {
    jest.spyOn(ValidateAppointmentHelper, 'isSunday').mockReturnValueOnce(true);

    const validFormat = `${day}/${month}`;
    const expectedError =
      ValidateAppointmentHelper.AppointmentIsValidHelper(validFormat);

    expect(expectedError).toBe(InvalidDateError.SUNDAY_DATE);
  });
  test('should return error if it is configured for monday does not open and the day for monday', () => {
    jest.spyOn(ValidateAppointmentHelper, 'isMonday').mockReturnValueOnce(true);
    jest
      .spyOn(ValidateAppointmentHelper, 'isOpenMonday')
      .mockReturnValueOnce(false);

    const validFormat = `${day}/${month}`;
    const expectedError =
      ValidateAppointmentHelper.AppointmentIsValidHelper(validFormat);

    expect(expectedError).toBe(InvalidDateError.INVALID_MONDAY_DATE);
  });
});

describe('Appointment Is Valid Helper Dezember', () => {
  test('should return invalid date with a invalid format in dezember date', () => {
    jest
      .spyOn(ValidateAppointmentHelper, 'isDezember')
      .mockReturnValueOnce(true);

    jest
      .spyOn(ValidateAppointmentHelper, 'getMoment')
      .mockImplementationOnce((): any => {
        throw new Error('mock invalid date');
      });

    const startTime = new Date(new Date().getFullYear(), 11, 1);
    const endTime = new Date(new Date().getFullYear(), 11, 31);

    const mockedTime = faker.date.between({from: startTime, to: endTime});

    const day = mockedTime.getDate();
    const month = mockedTime.getMonth() + 1;
    const invalidFormat = `${day}/${month}`;

    const expectedValid =
      ValidateAppointmentHelper.AppointmentIsValidHelper(invalidFormat);
    expect(expectedValid).toBe(ValidateAppointmentHelper.INVALID_DATE());
  });
  test('should return true with a valid format in dezember date', () => {
    jest
      .spyOn(ValidateIfIsDezember, 'ValidateIfIsDezemberHelper')
      .mockReturnValueOnce(true);
    const startTime = new Date(new Date().getFullYear(), 11, 1);
    const endTime = new Date(new Date().getFullYear(), 11, 31);

    const mockedTime = faker.date.between({from: startTime, to: endTime});
    const day = mockedTime.getDate();
    const month = mockedTime.getMonth() + 1;
    const year = mockedTime.getFullYear();

    const validFormat = `${day}/${month}/${year}`;

    const expectedValid =
      ValidateAppointmentHelper.AppointmentIsValidHelper(validFormat);

    expect(expectedValid).toBe(true);
  });
});
