export const getHours = (date) => date.hours();
export const getMins = (date) => date.minutes();

/**
 * Recebe duas datas de inicio e fim e retorna um texto de hora e min de inicio e fim
 * @param param0 {startDate, endDate} Data de inicio e fim
 * @returns Retorna hora:min de inicio e hora:min fim em formato texto. Ex: 09:00 - 12:00
 */
export const TransformStartAndEndDateInIntervalTimeHelper = ({
  startDate,
  endDate,
}): string => {
  const start = `${getHours(startDate)}:${getMins(startDate)}`;
  const end = `${getHours(endDate)}:${getMins(endDate)}`;
  return `${start} - ${end}`;
};
