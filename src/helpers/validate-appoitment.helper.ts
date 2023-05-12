import moment from 'moment';
import {InvalidDateError} from '../errors';
import {ValidateIfIsDezemberHelper} from './validate-if-is-dezember.helper';

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

/**
 * Função que recebe um dia/mês e valida se o formato é esperado pela aplicação
 * @param dayMonth dia/mês nesse formato DD/MM
 * @returns Retorna Erro ou bool true
 */
export const AppointmentIsValidHelper = (dayMonth: string): IResponse => {
  if (ValidateIfIsDezemberHelper()) {
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
