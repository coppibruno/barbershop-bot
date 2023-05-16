import moment, {Moment} from 'moment';
import {InvalidDateError} from '../errors';
import {ValidateIfIsDezemberHelper} from './validate-if-is-dezember.helper';
import {PadStartDateHelper} from './pad-start.helper';

type IResponse =
  | InvalidDateError.INVALID_DATE
  | InvalidDateError.INVALID_DATE_DEZEMBER
  | InvalidDateError.SUNDAY_DATE
  | InvalidDateError.SUNDAY_DATE_DEZEMBER
  | true;

export const isDezember = () => !!ValidateIfIsDezemberHelper();

export const getMoment = (dayMonthYear: string) => {
  const date = moment(dayMonthYear, 'DD/MM/YYYY')
    .hours(23)
    .minutes(59)
    .seconds(59);
  return date;
};

export const isSunday = (date: Moment) => {
  return date.isoWeekday() === 7;
};
export const isBefore = (date: Moment) => {
  return date.isBefore();
};

export const INVALID_DATE = () => {
  return isDezember() === true
    ? InvalidDateError.INVALID_DATE_DEZEMBER
    : InvalidDateError.INVALID_DATE;
};

export const INVALID_SUNDAY = () => {
  return isDezember() === true
    ? InvalidDateError.SUNDAY_DATE_DEZEMBER
    : InvalidDateError.SUNDAY_DATE;
};

/**
 * Função que recebe um dia/mês e valida se o formato é esperado pela aplicação
 * @param dayMonth dia/mês nesse formato DD/MM
 * @returns Retorna Erro ou bool true
 */
export const AppointmentIsValidHelper = (dayMonth: string): IResponse => {
  const [day, month] = dayMonth.split('/');
  const newDay = PadStartDateHelper(day, 2);
  const newMonth = PadStartDateHelper(month, 2);

  dayMonth = `${newDay}/${newMonth}`;

  let date;
  try {
    if (!isDezember()) {
      dayMonth += `/${new Date().getFullYear()}`;
    }

    date = getMoment(dayMonth);
  } catch (error) {
    return INVALID_DATE();
  }

  if (isBefore(date)) {
    return INVALID_DATE();
  }

  //Sunday
  if (isSunday(date)) {
    return INVALID_SUNDAY();
  }

  return true;
};
