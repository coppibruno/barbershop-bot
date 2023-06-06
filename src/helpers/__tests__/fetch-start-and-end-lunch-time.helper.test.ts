import {faker} from '@faker-js/faker';
import * as FetchStartAndEndLunch from '../fetch-start-and-end-lunch-time.helper';
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

describe('Fetch Start And End Lunch Time Helper', () => {
  test('should return start and end lunch time', () => {
    const start = '12:00';
    const end = '13:00';

    const result = FetchStartAndEndLunch.FetchStartAndEndLunchTimeHelper(
      start,
      end,
    );

    expect(result).toHaveProperty('start');
    expect(result).toHaveProperty('end');
  });
  test('should return error if invalid param is provided', () => {
    const start = '12-00';
    const end = '13-00';

    expect(() =>
      FetchStartAndEndLunch.FetchStartAndEndLunchTimeHelper(start, end),
    ).toThrow(STEP_NOT_IMPLEMETED);

    expect(() =>
      FetchStartAndEndLunch.FetchStartAndEndLunchTimeHelper('12h', '13h'),
    ).toThrow(STEP_NOT_IMPLEMETED);
  });
});
