import {ValidateIfIsDezemberHelper} from '../validate-if-is-dezember.helper';

jest.mock('moment', () => () => {
  return {
    month: () => 11,
  };
});
describe('Validate If Is Dezember Helper', () => {
  test('should return true if month is december', () => {
    const isDezember = ValidateIfIsDezemberHelper();
    expect(isDezember).toBe(true);
  });
});
