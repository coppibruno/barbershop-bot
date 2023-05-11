import momentTimezone from 'moment-timezone';
export const moment = (date: Date | string, format: string) => {
  return momentTimezone(date, format);
};
