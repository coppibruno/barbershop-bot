import moment from 'moment-timezone';

export const ValidateIfIsDezemberHelper = (): boolean => {
  return moment().month() + 1 === 12;
};
