type ResultArray = {
  option: number;
  appointment: string;
};

/**
 * Recebe um objeto de apontamentos e formata em array
 * @param options objeto de opções. Ex: {appointment: '09:00', appointment: '10:00' ...}
 * @returns Array formatado com propriedades de Option e Appointment. Ex: [{option: 1, appointment: '09:00'}, ...]
 */
export const TransformSampleObjectInFormattedArrayHelper = (
  options: string[],
): ResultArray[] => {
  const appointments = Object.values(options).map(String);

  let count = 0;
  const result = appointments.map((description) => {
    count++;
    return {option: count, appointment: description};
  });
  return result;
};
