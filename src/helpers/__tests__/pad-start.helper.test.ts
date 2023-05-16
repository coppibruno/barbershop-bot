import {PadStartDateHelper} from '../pad-start.helper';

describe('Pad Start Helper', () => {
  test('must return a number with size at least 2', () => {
    const testCase = [0, 5, 10];
    const size = 2;

    for (const test of testCase) {
      expect(PadStartDateHelper(test, size)).toHaveLength(2);
    }
  });
});
