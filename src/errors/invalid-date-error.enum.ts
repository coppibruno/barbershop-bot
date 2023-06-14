export enum InvalidDateError {
  INVALID_DATE = 'Data inválida. Digite uma data futura, conforme o formato, 01/02',
  SUNDAY_DATE = 'Data inválida. No domingo não atendemos. Tente novamente outra data. Neste formato: 01/02',

  INVALID_DATE_DEZEMBER = 'Data inválida. Digite uma data futura, conforme o formato, 01/02/2023',
  SUNDAY_DATE_DEZEMBER = 'Data inválida. No domingo não atendemos. Tente novamente outra data. Neste formato: 01/02/2023',

  INVALID_MONDAY_DATE = 'Data inválida. Na segunda não atendemos. Tente novamente outra data. Neste formato: 01/02/2023',
  INVALID_MONDAY_DATE_DEZEMBER = 'Data inválida. Na segunda não atendemos. Tente novamente outra data. Neste formato: 01/02/2023',
}
