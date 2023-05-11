import moment, {Moment} from 'moment';
import {ValidateIfIsDezember} from './validate-if-is-dezember';
import {InvalidDateError} from '../errors';

const TransformAppointmentInDateHelperDezember = (dayMonthYear: string) => {
  let date;
  try {
    date = moment(dayMonthYear, 'DD/MM/YYYY');
  } catch (error) {
    console.log(error);
    return InvalidDateError.INVALID_DATE_DEZEMBER;
  }

  return date;
};

export const TransformAppointmentInDateHelper = (
  dayMonth: string,
):
  | Moment
  | InvalidDateError.INVALID_DATE
  | InvalidDateError.INVALID_DATE_DEZEMBER => {
  if (ValidateIfIsDezember()) {
    return TransformAppointmentInDateHelperDezember(dayMonth);
  }
  let date;
  try {
    date = moment(dayMonth, 'DD/MM/YYYY');
  } catch (error) {
    console.log(error);
    return InvalidDateError.INVALID_DATE;
  }

  return date;
};
