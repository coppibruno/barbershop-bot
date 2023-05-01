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
}
