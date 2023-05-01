import moment from 'moment';
export const AppointmentIsValidHelper = (dayMonth: string) => {
  if (dayMonth.length !== 5) {
    return false;
  }
  if (dayMonth[2] !== '/') {
    return false;
  }

  const splited = dayMonth.split('/');
  const day = splited[0];
  const month = splited[1];
  const fullDate = `${day}/${month}/2023`;
  const date = moment(fullDate, 'DD/MM/YYYY');

  if (date.isBefore()) {
    return false;
  }

  return true;
};
