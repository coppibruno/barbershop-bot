import moment from 'moment';
import {InvalidDateError} from '../errors';
import {ValidateIfIsDezember} from './validate-if-is-dezember';

type IResponse =
  | InvalidDateError.INVALID_DATE
  | InvalidDateError.INVALID_DATE_DEZEMBER
  | InvalidDateError.SUNDAY_DATE
  | InvalidDateError.SUNDAY_DATE_DEZEMBER
  | true;

const AppointmentIsValidHelperDezember = (dayMonthYear: string): IResponse => {
  let date;
  try {
    date = moment(dayMonthYear, 'DD/MM/YYYY').hours(23).minutes(59).seconds(59);
  } catch (error) {
    console.error(error);
    return InvalidDateError.INVALID_DATE_DEZEMBER;
  }

  if (date.isBefore()) {
    return InvalidDateError.INVALID_DATE_DEZEMBER;
  }

  //Sunday
  if (date.isoWeekday() === 7) {
    return InvalidDateError.SUNDAY_DATE_DEZEMBER;
  }

  return true;
};

export const AppointmentIsValidHelper = (dayMonth: string): IResponse => {
  if (ValidateIfIsDezember()) {
    return AppointmentIsValidHelperDezember(dayMonth);
  }

  let date;
  try {
    const fullDate = `${dayMonth}/${new Date().getFullYear()}`;
    date = moment(fullDate, 'DD/MM/YYYY').hours(23).minutes(59).seconds(59);
  } catch (error) {
    console.error(error);
    return InvalidDateError.INVALID_DATE;
  }

  if (date.isBefore()) {
    return InvalidDateError.INVALID_DATE;
  }

  //Sunday
  if (date.isoWeekday() === 7) {
    return InvalidDateError.SUNDAY_DATE;
  }

  return true;
};
