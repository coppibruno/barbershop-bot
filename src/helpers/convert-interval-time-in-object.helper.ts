import {InvalidDataIsProvidedError} from '@/errors';
import {TransformAppointmentInDateHelper} from './transform-appointment-in-date.helper';
import {FlowContext} from '@/flow.context';

export const getClone = (date) => date.clone();
export const setHours = (date, hour) => date.hours(hour);
export const setMinutes = (date, min) => date.minutes(min);
export const setSeconds = (date, sec) => date.seconds(sec);
export const isSaturday = (date) => date.isoWeekday() === 6;
export const getMaxSaturdayTime = () =>
  FlowContext.END_SATURDAY_APPOINTMENT_DAY;
export const getMaxTimeDay = () => FlowContext.END_APPOINTMENT_DAY;

type IResponse = {
  startTime: string;
  endTime: string;
  startDate: Date;
  endDate: Date;
};

/**
 * Recebe um intervalo de tempo e separa em objeto. Caso o intervalo final não seja provido, assume-se o tempo máximo de agendamento do dia
 * @param dayMonth dia/mês Ex: 10/06
 * @param intervalTime intervalo de tempo. Exs: 09:00, 09:00 - 16:00
 * @returns {startTime, endTime}
 */
export const ConvertIntervalTimeInObject = (
  dayMonth: string,
  intervalTime: string,
): IResponse => {
  const length = intervalTime.length;

  let startTime, endTime;

  //EXPECT FORMAT 09:00 - 15:00
  if (length > 5) {
    const [paramStartTime, paramEndTime] = intervalTime.split('-');
    if (!paramStartTime || !paramEndTime) {
      throw new InvalidDataIsProvidedError(
        'invalid param interval time is provided ConvertIntervalTimeInObject',
      );
    }

    startTime = paramStartTime;
    endTime = paramEndTime;
  } else {
    //EXPECT FORMAT 09:00
    startTime = intervalTime;

    const date = TransformAppointmentInDateHelper(dayMonth);

    const saturday = isSaturday(date);

    const maxTime = saturday ? getMaxSaturdayTime() : getMaxTimeDay();

    endTime = maxTime;
  }

  const startDate = TransformAppointmentInDateHelper(dayMonth);

  const [startTimeHours, startTimeMinutes] = startTime.split(':');
  const [endTimeHours, endTimeMinutes] = endTime.split(':');

  setHours(startDate, startTimeHours);
  setMinutes(startDate, startTimeMinutes);
  setSeconds(startDate, 0);

  const endDate = getClone(startDate);
  setHours(endDate, endTimeHours);
  setMinutes(endDate, endTimeMinutes);
  setSeconds(endDate, 0);

  return {
    startTime,
    endTime,
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
  };
};
