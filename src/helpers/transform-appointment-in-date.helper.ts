import moment, {Moment} from 'moment';
import {ValidateIfIsDezemberHelper} from './validate-if-is-dezember.helper';
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

/**
 * Função que recebe o dia e mês e retorna um objeto de data
 * @param dayMonth dia/mes - dia e mes no formato DD/MM
 * @returns object moment de data
 */
export const TransformAppointmentInDateHelper = (
  dayMonth: string,
):
  | Moment
  | InvalidDateError.INVALID_DATE
  | InvalidDateError.INVALID_DATE_DEZEMBER => {
  if (ValidateIfIsDezemberHelper()) {
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
