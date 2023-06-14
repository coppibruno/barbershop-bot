import {FlowContext} from '@/flow.context';
import {Moment} from 'moment';

export const getClone = (date) => date.clone();
export const setHours = (date, hour) => date.hours(hour);
export const setMinutes = (date, min) => date.minutes(min);
export const setSeconds = (date, sec) => date.seconds(sec);

export const isSaturday = (date) => date.isoWeekday() === 6;

const startAppointmentDay = FlowContext.START_APPOINTMENT_DAY;
const endAppointmentDay = FlowContext.END_APPOINTMENT_DAY;
const startSaturdayAppointmentDay = FlowContext.START_SATURDAY_APPOINTMENT_DAY;
const endSaturdayAppointmentDay = FlowContext.END_SATURDAY_APPOINTMENT_DAY;
/**
 * Recebe uma data e preenche com data de inicio e fim do apontamento minimo e máximo de um dia.
 * @param date Data a ser processada
 * @returns Retorna um objeto com data inicio e fim com horário min e máx do dia
 */
export const FetchMaxAndMinAppointmentFromDay = (
  date: Moment,
): {
  startDate: Date;
  endDate: Date;
} => {
  const startTime = startAppointmentDay.split(':');
  const endTime = endAppointmentDay.split(':');

  let startHour = Number(startTime[0]);
  let startMin = Number(startTime[1]);

  let endHour = Number(endTime[0]);
  let endMin = Number(endTime[1]);

  const saturday = isSaturday(date);

  if (saturday) {
    const startTime = startSaturdayAppointmentDay.split(':');
    const endTime = endSaturdayAppointmentDay.split(':');

    startHour = Number(startTime[0]);
    startMin = Number(startTime[1]);

    endHour = Number(endTime[0]);
    endMin = Number(endTime[1]);
  }

  const start = getClone(date);
  const end = getClone(date);

  setHours(start, startHour);
  setMinutes(start, startMin);
  setSeconds(start, 0);

  setHours(end, endHour);
  setMinutes(end, endMin);
  setSeconds(end, 0);

  return {startDate: start.toDate(), endDate: end.toDate()};
};
