import ConversationRepository from '../repositories/conversationRepository';

export class GetResponseByAccountService {
  private readonly serviceRepository;

  constructor(serviceRepository: ConversationRepository) {
    this.serviceRepository = serviceRepository;
  }

  async getUserName(listConvesation: any) {
    return listConvesation[2].body;
  }

  async execute(accountId: string) {
    const conversation = await this.serviceRepository.find({
      where: {
        accountId: accountId,
        fromPhone: 14155238886, //adicionar env
      },
    });

    //instalar biblioteca de date para verificar se teve iteração nas ultimas 2hrs. Caso não tenha. mandar mensagem de boas vindas (1° passo)
    //verificar a ultima resposta do robô para responder ao usuario
    //mostrar o menu

    if (conversation.length === 0) {
      return 'Olá, seja bem vindo a Brodis Barbearia. Como você gostaria de ser identificado?';
    } else if (conversation.length === 1) {
      const name = await this.getUserName();
      return `${name}, qual dia você gostaria de marcar agendamento? Digite dia/mês. Exemplo 01/04`;
    } else {
      return 'valor não implementado';
    }
  }
}
