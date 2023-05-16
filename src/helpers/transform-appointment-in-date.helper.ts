import moment, {Moment} from 'moment';
import {ValidateIfIsDezemberHelper} from './validate-if-is-dezember.helper';
import {InvalidDateError} from '../errors';

export const getMoment = (dayMonth: string) => moment(dayMonth, 'DD/MM/YYYY');

export const isDezember = () => !!ValidateIfIsDezemberHelper();

export const INVALID_DATE = () => {
  return isDezember()
    ? InvalidDateError.INVALID_DATE_DEZEMBER
    : InvalidDateError.INVALID_DATE;
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
  let date;

  if (!isDezember()) {
    dayMonth += `/${new Date().getFullYear()}`;
  }

  try {
    date = getMoment(dayMonth);
  } catch (error) {
    return INVALID_DATE();
  }
  return date;
};
