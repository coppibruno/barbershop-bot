/**
 * Remove espaços em branco de dentro e nas laterais de uma string
 * @param text Texto
 * @returns Texto sem espaços
 */
export const RemoveBlankSpacesHelper = (text: string) => {
  return text.replace(/\s/g, '').trim();
};
