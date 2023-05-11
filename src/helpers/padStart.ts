/**
 * Recebe um valor de adiciona um prefixo. Ex: Recebe 1 e devolve 01
 * @param value data 1
 * @param padStar número de casas. Ex: 2.
 */
export const PadStartDate = (
  value: string | number,
  padStart: number,
): string => {
  return String(value).padStart(padStart, '0');
};
