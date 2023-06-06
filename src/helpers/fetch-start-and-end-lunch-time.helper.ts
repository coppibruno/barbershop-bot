import moment, {Moment} from 'moment';
import {STEP_NOT_IMPLEMETED} from '@/errors';

interface IResultLunchTime {
  start?: Moment;
  end?: Moment;
}

/**
 * Recebe hora de início e término da folga de almoço e retorna objeto data
 * @param startTime hour/min: Exemplo: 12:00
 * @param endTime hour/min: Exemplo: 13:00
 */
export const FetchStartAndEndLunchTimeHelper = (
  startTime: string,
  endTime: string,
): IResultLunchTime => {
  const start = startTime.split(':');
  const end = endTime.split(':');

  if (start.length !== 2 || end.length !== 2) {
    throw STEP_NOT_IMPLEMETED;
  }

  const startHour = Number(start[0]);
  const startMin = Number(start[1]);

  const endHour = Number(end[0]);
  const endMin = Number(end[1]);

  return {
    start: moment().hour(startHour).minute(startMin).subtract(1, 'minute'),
    end: moment().hour(endHour).minute(endMin).subtract(1, 'minute'),
  };
};
