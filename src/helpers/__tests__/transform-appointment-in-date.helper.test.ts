import {faker} from '@faker-js/faker';
import * as TransformAppointmentInDateHelper from '../transform-appointment-in-date.helper';
const mockedTime = faker.date.future();
const day = mockedTime.getDate();
const month = mockedTime.getMonth() + 1;

jest
  .spyOn(TransformAppointmentInDateHelper, 'getMoment')
  .mockImplementationOnce(() => mockedTime as any);

describe('Transform Appointment In Date Helper', () => {
  test('should return date in valid format', () => {
    const dayMonth = `${day}/${month}`;

    const result =
      TransformAppointmentInDateHelper.TransformAppointmentInDateHelper(
        dayMonth,
      );

    expect(result).toBeTruthy();
    expect(result).toBe(mockedTime);
  });
});
