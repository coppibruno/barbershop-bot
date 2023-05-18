import 'dotenv/config';
const barbershopName = process.env.BARBERSHOP_NAME;
const botNumber = process.env.BOT_NUMBER;
const startAppointmentDay = process.env.START_TIME || '9:00';
const endAppointmentDay = process.env.END_TIME || '19:00';
const startSaturdayAppointmentDay = process.env.SATURDAY_START_TIME || '9:00';
const endStartudayAppointmentDay = process.env.SATURDAY_END_TIME || '12:00';
const startLunchTimeOff = process.env.START_LUNCH_TIME;
const endLunchTimeOff = process.env.END_LUNCH_TIME;
const appointmentTimeInMinutes = process.env.SERVICE_TIME_IN_MINUTES || '60';

export class FlowContext {
  public static readonly WELCOME = `Olá, seja bem vindo(a) a ${barbershopName}. Como você gostaria de ser identificado?`;
  public static readonly MENU = [
    '1- Agendar horário',
    '2- Trocar nome de identificação',
    '0- Encerrar atendimento',
  ];
  public static readonly MENU_2 = [
    {option: 0, label: 'Encerrar atendimento'},
    {option: 1, label: 'Agendar horário'},
    {option: 2, label: 'Trocar nome de identificação'},
  ];
  public static readonly MENU_LENGTH = this.MENU.length;
  public static readonly MAKE_APPOINTMENT: string =
    'Para agendar, digite o dia e mês. Exemplo: 01/02';
  public static readonly MAKE_APPOINTMENT_DEZEMBER: string =
    'Para agendar, digite o dia/mês/ano. Exemplo: 01/02/2023';
  public static readonly RENAME_USER = 'Como você gostaria de ser chamado?';
  public static readonly GOODBYE = `${barbershopName} agradece seu contato. Esperamos você em breve!`;
  public static readonly TIME_NOT_FOUND =
    'Horário não encontrado. Digite novamente.';
  public static readonly TIME_FOUND = `Horário marcado. ${barbershopName} agradece a preferencia, nos encontramos no dia X`;
  public static readonly START_APPOINTMENT_DAY = startAppointmentDay;
  public static readonly END_APPOINTMENT_DAY = endAppointmentDay;
  public static readonly START_SATURDAY_APPOINTMENT_DAY =
    startSaturdayAppointmentDay;
  public static readonly END_SATURDAY_APPOINTMENT_DAY =
    endStartudayAppointmentDay;
  public static readonly START_LUNCH_TIME = startLunchTimeOff;
  public static readonly END_LUNCH_TIME = endLunchTimeOff;
  public static readonly APPOINTMENT_TIME_IN_MINUTES = appointmentTimeInMinutes;
  public static readonly BOT_NUMBER = botNumber;
  public static readonly LAST_ITERATION: number = 5;
  public static readonly OPTION_RETRY_DATE_APPOINTMENT = 0;

  static getIndexMenu(): number[] {
    const lastIndex = this.MENU.length - 1;

    const indexMenu = [];
    for (let index = 0; index <= lastIndex; index++) {
      indexMenu.push(index);
    }

    return indexMenu;
  }

  static getStartLunchTime(): string | boolean {
    return !this.START_LUNCH_TIME ? false : this.START_LUNCH_TIME;
  }

  static getEndLunchTime(): string | boolean {
    return !this.END_LUNCH_TIME ? false : this.END_LUNCH_TIME;
  }

  static successfulAppointmentMessage(date: string, time: string): string {
    return `Horário Agendado com sucesso para o dia ${date} às ${time}. \n${this.GOODBYE}`;
  }
}
