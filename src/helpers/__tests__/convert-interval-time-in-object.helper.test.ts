import {faker} from '@faker-js/faker';
import * as ConvertIntervalTimeInObject from '../convert-interval-time-in-object.helper';
const mockedTime = faker.date.future();
const day = mockedTime.getDate();
const month = mockedTime.getMonth() + 1;

jest
  .spyOn(ConvertIntervalTimeInObject, 'isSaturday')
  .mockImplementationOnce(() => false);
jest
  .spyOn(ConvertIntervalTimeInObject, 'getMaxSaturdayTime')
  .mockImplementationOnce(() => '12:00');
jest
  .spyOn(ConvertIntervalTimeInObject, 'getMaxTimeDay')
  .mockImplementationOnce(() => '20:00');

describe('Convert Interval Time In Object Helper', () => {
  test('should return a object with startTime and endTime on success', () => {
    const dayMonth = `${day}/${month}`;
    const intervalTime = '09:00';

    const result = ConvertIntervalTimeInObject.ConvertIntervalTimeInObject(
      dayMonth,
      intervalTime,
    );

    expect(result.startTime).toBe('09:00');
    expect(result.endTime).toBe('20:00');
  });
  test('should return a object with startTime and endTime in saturday day', () => {
    const dayMonth = `${day}/${month}`;
    const intervalTime = '09:00';
    jest
      .spyOn(ConvertIntervalTimeInObject, 'isSaturday')
      .mockImplementationOnce(() => true);
    const result = ConvertIntervalTimeInObject.ConvertIntervalTimeInObject(
      dayMonth,
      intervalTime,
    );

    expect(result.startTime).toBe('09:00');
    expect(result.endTime).toBe('12:00');
  });
});
