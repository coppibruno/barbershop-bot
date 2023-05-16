import moment from 'moment';

export const ValidateIfIsDezemberHelper = (): boolean => {
  return moment().month() + 1 === 12;
};
