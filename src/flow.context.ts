import 'dotenv/config';
const barbershopName = process.env.BARBERSHOP_NAME;
const botNumber = process.env.BOT_NUMBER;
const adminNumber = process.env.ADMIN_PHONE;
const startAppointmentDay = process.env.START_TIME || '9:00';
const endAppointmentDay = process.env.END_TIME || '19:00';
const startSaturdayAppointmentDay = process.env.SATURDAY_START_TIME || '9:00';
const endStartudayAppointmentDay = process.env.SATURDAY_END_TIME || '12:00';
const startLunchTimeOff = process.env.START_LUNCH_TIME;
const endLunchTimeOff = process.env.END_LUNCH_TIME;
const appointmentTimeInMinutes = process.env.SERVICE_TIME_IN_MINUTES || '60';
const isOpenMonday = process.env.OPEN_MONDAY === 'false' ? false : true;

export enum typeMenuUser {
  CLOSE_SERVICE = 'CLOSE_SERVICE',
  APPOINTMENT = 'APPOINTMENT',
  CHANGE_NAME = 'CHANGE_NAME',
}
export enum typeMenuAdmin {
  SHOW_MENU_MEETING = 'SHOW_MENU_MEETING',
  MARK_OFF_MEETING = 'MARK_OFF_MEETING',
  SHOW_MENU_AGAIN = 'SHOW_MENU_AGAIN',
}

export class FlowContext {
  public static readonly WELCOME = `Olá, seja bem vindo(a) a ${barbershopName}. Como você gostaria de ser identificado?`;
  public static readonly ADMIN_WELCOME = `Olá. Seja bem vindo ao menu de adminstradores da ${barbershopName}!\nSelecione a opção desejada 1 ou 2\n`;
  public static readonly MENU_ADMIN = [
    {
      option: 1,
      type: typeMenuAdmin.SHOW_MENU_MEETING,
      label: '1- Visualizar agendamentos de algum dia',
      callback:
        'Para buscar os agendamentos, digite um dia/mês, conforme exemplo: 01/02',
    },
    {
      option: 2,
      type: typeMenuAdmin.MARK_OFF_MEETING,
      label: '2- Desmarcar horários',
      callback:
        'Para desmarcar um horário, digite um dia/mês e o intervalo de horário, conforme exemplo: 01/02 9:00-10:00. Para desativar o dia inteiro digite apenas o dia/mês conforme exemplo 01/02',
    },
  ];

  public static getMenuUserFormatted = () => {
    const closeMenu = this.MENU_2.find(
      (item) => item.type === typeMenuUser.CLOSE_SERVICE,
    );

    const newMenu = this.MENU_2.filter(
      (item) => item.type !== typeMenuUser.CLOSE_SERVICE,
    );

    newMenu.push(closeMenu);

    return newMenu.map(({option, label}) => `${option} - ${label}`);
  };
  public static readonly MENU_2 = [
    {
      option: 0,
      type: typeMenuUser.CLOSE_SERVICE,
      label: 'Encerrar atendimento',
    },
    {option: 1, type: typeMenuUser.APPOINTMENT, label: 'Agendar horário'},
    {
      option: 2,
      type: typeMenuUser.CHANGE_NAME,
      label: 'Trocar nome de identificação',
    },
  ];

  public static readonly BAERBER_SHOP_NAME: string = barbershopName;
  public static readonly MAKE_APPOINTMENT: string =
    'Para agendar, digite o dia e mês. Exemplo: 01/02';
  public static readonly MAKE_APPOINTMENT_DEZEMBER: string =
    'Para agendar, digite o dia/mês/ano. Exemplo: 01/02/2023';
  public static readonly RENAME_USER = 'Como você gostaria de ser chamado?';
  public static readonly GOODBYE = `${barbershopName} agradece seu contato. Esperamos você em breve!`;
  public static readonly SUCCESSFUL_OPERATION = `Operação realizada com sucesso. ${this.GOODBYE}`;
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
  public static readonly ADMIN_NUMBER: number = Number(adminNumber);
  public static readonly LAST_ITERATION: number = 5;
  public static readonly OPTION_RETRY_DATE_APPOINTMENT = 0;
  public static IS_OPEN_MONDAY: boolean = isOpenMonday;

  static getStartLunchTime(): string | boolean {
    return !this.START_LUNCH_TIME ? false : this.START_LUNCH_TIME;
  }

  static getEndLunchTime(): string | boolean {
    return !this.END_LUNCH_TIME ? false : this.END_LUNCH_TIME;
  }

  static successfulAppointmentMessage(date: string, time: string): string {
    return `Horário Agendado com sucesso para o dia ${date} às ${time}. \n${this.GOODBYE}`;
  }

  static getMenuConfirmationCancelAppointment(msgCancel?: string) {
    return [
      {
        option: 1,
        type: typeMenuAdmin.MARK_OFF_MEETING,
        label: msgCancel,
        step: 3,
      },
      {
        option: 0,
        label: 'Retornar ao menu de admin',
        type: typeMenuAdmin.SHOW_MENU_AGAIN,
        step: 1,
      },
    ];
  }
}
