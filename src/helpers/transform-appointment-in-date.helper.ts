import moment, {Moment} from 'moment';
import {ValidateIfIsDezemberHelper} from './validate-if-is-dezember.helper';

export const getMoment = (dayMonth: string) => moment(dayMonth, 'DD/MM/YYYY');

export const isDezember = () => !!ValidateIfIsDezemberHelper();

/**
 * Função que recebe o dia e mês e retorna um objeto de data
 * @param dayMonth dia/mes - dia e mes no formato DD/MM
 * @returns object moment de data
 */
export const TransformAppointmentInDateHelper = (dayMonth: string): Moment => {
  let date;

  if (!isDezember()) {
    dayMonth += `/${new Date().getFullYear()}`;
  }

  date = getMoment(dayMonth);

  return date;
};
