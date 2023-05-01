export const AppointmentIsValidHelper = (dayMonth: string) => {
  if (dayMonth.length !== 5) {
    return false;
  }
  if (dayMonth[2] !== '/') {
    return false;
  }
  return true;
};
