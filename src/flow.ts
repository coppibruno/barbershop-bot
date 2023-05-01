import 'dotenv/config';
const barbershopName = process.env.BARBERSHOP_NAME;

export class FlowContext {
  public static readonly WELCOME = `Olá, seja bem vindo(a) a ${barbershopName}. Como você gostaria de ser identificado?`;
  public static readonly MENU = [
    '1- Agendar horário',
    '2- Trocar nome de identificação',
    '0- Encerrar atendimento',
  ];
  public static readonly MENU_LENGTH = this.MENU.length;
  public static readonly MAKE_APPOINTMENT =
    'Para agendar um horário digite o dia e mês. Exemplo: 01/02';
  public static readonly RENAME_USER = 'Como você gostaria de ser chamado?';
  public static readonly GOODBYE = `${barbershopName} agradece seu contato. Esperamos você em breve!`;
  public static readonly TIME_NOT_FOUND =
    'Horário não encontrado. Digite novamente.';
  public static readonly TIME_FOUND = `Horário marcado. ${barbershopName} agradece a preferencia, nos encontramos no dia X`;

  static getIndexMenu(): number[] {
    const lastIndex = this.MENU.length - 1;

    const indexMenu = [];
    for (let index = 0; index <= lastIndex; index++) {
      indexMenu.push(index);
    }

    return indexMenu;
  }

  static showMenu(user: string) {
    return (
      `${user}, escolha uma opção de 0 a 2. \n ` +
      this.MENU.map((item) => `${item} \n`)
    );
  }

  static getTextByMenu(menu: number): string {
    type IResponseByAccount = {
      [key: number]: string;
    };
    const options: IResponseByAccount = {
      0: this.MAKE_APPOINTMENT,
      1: this.RENAME_USER,
    };
    return options[menu];
  }

  static showTextByMenu(menuSelected: number) {
    if (menuSelected === 0) {
      return this.GOODBYE;
    }
    const menu = menuSelected - 1;
    return this.getTextByMenu(menu);
  }

  static findAvaliableTime(dayMonth: string) {
    return `Para o dia ${dayMonth} temos esses horários disponiveis: \n
        09:00 \n
        10:00 \n
        11:00 \n
        14:00 \n
        15:00 \n
        17:00 \n
        18:00 \n
        19:00 \n
    `;
  }
}
