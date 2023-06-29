import {ConversationEntity} from '@/entity/conversation.entity';

import {GetConversationTwilio} from '@/external/twilio/get-conversation';

import {FlowContext} from '@/flow.context';

import {IConversationTwilio} from '@/interfaces/external';

//services
import {
  CreateConversationService,
  GetLastMessageInProgressConversationService,
  SendMessageWhatsappService,
} from '@/services';

//admin services
import {GetAdminResponseByAccountService} from './get-admin-response-by-account.service';

/**
 * Responsável pelo fluxo de receber mensagem do usuário, persistir, processar e buscar dados, retornar a mensagem do assistênte virtual (MENU ADMINISTRADOR)
 */
export class FlowAdminConversationService {
  private readonly getConversationTwilio: GetConversationTwilio;
  private readonly createConversationService: CreateConversationService;
  private readonly getAdminResponseByAccountService: GetAdminResponseByAccountService;
  private readonly sendMessageWhatsappService: SendMessageWhatsappService;
  private readonly getLastMessageInProgressConversationService: GetLastMessageInProgressConversationService;

  constructor(
    getConversationTwilio: GetConversationTwilio,
    createConversationService: CreateConversationService,
    getAdminResponseByAccountService: GetAdminResponseByAccountService,
    sendMessageWhatsappService: SendMessageWhatsappService,
    getLastMessageInProgressConversationService: GetLastMessageInProgressConversationService,
  ) {
    this.getConversationTwilio = getConversationTwilio;
    this.createConversationService = createConversationService;
    this.getAdminResponseByAccountService = getAdminResponseByAccountService;
    this.sendMessageWhatsappService = sendMessageWhatsappService;
    this.getLastMessageInProgressConversationService =
      getLastMessageInProgressConversationService;
  }

  async execute(message: IConversationTwilio): Promise<string> {
    const senderConversationEntity: ConversationEntity =
      this.getConversationTwilio.execute(message);

    const lastMessage =
      await this.getLastMessageInProgressConversationService.execute(
        senderConversationEntity.accountId,
      );

    if (lastMessage) {
      senderConversationEntity.protocol = lastMessage.protocol;
      senderConversationEntity.step = lastMessage.step;
      senderConversationEntity.name = lastMessage.name;
      senderConversationEntity.options = lastMessage.options;
    }

    await this.createConversationService.execute(senderConversationEntity);

    const reply = await this.getAdminResponseByAccountService.execute(
      senderConversationEntity.accountId,
    );
    const {options = [], response, step, state} = reply;

    const name = FlowContext.BAERBER_SHOP_NAME;

    const botAnswer: ConversationEntity = {
      fromPhone: Number(FlowContext.BOT_NUMBER),
      toPhone: senderConversationEntity.fromPhone,
      body: response,
      accountId: senderConversationEntity.accountId,
      messageId: senderConversationEntity.messageId,
      name: name || '',
      state: state || 'IN_PROGRESS',
      options,
      step,
      protocol: senderConversationEntity.protocol,
    };

    await this.sendMessageWhatsappService.execute(botAnswer);

    await this.createConversationService.execute(botAnswer);

    return response;
  }
}
