import moment from 'moment-timezone';

export const ValidateIfIsDezember = (): boolean => {
  return moment().month() + 1 === 12;
};
