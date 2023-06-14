import {InvalidDataIsProvidedError, STEP_NOT_IMPLEMETED} from '@/errors';
import {TransformAppointmentInDateHelper} from './transform-appointment-in-date.helper';

export const isValid = (appointmentTime: string): boolean => {
  if (!appointmentTime.includes('-')) {
    return false;
  }
  const appointmentSplit = appointmentTime.split('-');
  return appointmentSplit.every(
    (appointment) =>
      appointment.trim().length === 5 && appointment.split(':').length === 2,
  );
};

interface IStartAndEndDate {
  startDate: Date;
  endDate: Date;
}
/**
 * Recebe o dia/mes do agendamento e o horário de inicio e fim e retorna data de inicio e fim no formato moment
 * @param dayMonth dia/mes Ex 12/05
 * @param appointmentTime agendamento ou hora/min inicio e hora/min fim. Ex: '09:00 - 10:00'
 * @returns objeto com data inicio e fim
 */
export const FetchStartAndEndAppointmentTimeHelper = (
  dayMonth: string,
  appointmentTime: string,
): IStartAndEndDate => {
  const startDate = TransformAppointmentInDateHelper(dayMonth);

  const appointmentSplit = appointmentTime.split('-');

  if (!isValid(appointmentTime)) {
    throw new InvalidDataIsProvidedError(
      'invalid data is provided on FetchStartAndEndAppointmentTimeHelper',
    );
  }

  const startAppointment = appointmentSplit[0];
  const endAppointment = appointmentSplit[1];

  const startTime = {
    hours: Number(startAppointment.trim().split(':')[0]),
    minutes: Number(startAppointment.trim().split(':')[1]),
  };

  const endTime = {
    hours: Number(endAppointment.trim().split(':')[0]),
    minutes: Number(endAppointment.trim().split(':')[1]),
  };

  startDate.hours(startTime.hours).minutes(startTime.minutes).seconds(0);
  const endDate = startDate
    .clone()
    .hours(endTime.hours)
    .minutes(endTime.minutes)
    .seconds(0);
  return {
    startDate: new Date(startDate.toDate()),
    endDate: new Date(endDate.toDate()),
  };
};
