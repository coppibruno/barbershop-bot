import {ConversationEntity} from '../entity/conversation.entity';

import {GetConversationTwilio} from '../external/twilio/get-conversation';

import {FlowContext} from '../flow.context';

import {IConversationTwilio} from '../interfaces/external';

//services
import {CreateConversationService} from './create-conversation.service';
import {GetLastMessageInProgressConversationService} from './get-last-message-in-progress.service';
import {GetResponseByAccountService} from './get-response-by-account.service';
import {GetUserNameConversation} from './get-user-name.service';
import {SendMessageWhatsappService} from './send-message.service';

/**
 * Responsável pelo fluxo de receber mensagem do usuário, persistir, processar e buscar dados, retornar a mensagem do assistênte virtual
 */
export class FlowConversationService {
  private readonly getConversationTwilio;
  private readonly createConversationService;
  private readonly getResponseByAccountService;
  private readonly sendMessageWhatsappService;
  private readonly getUserNameConversation: GetUserNameConversation;
  private readonly getLastMessageInProgressConversationService: GetLastMessageInProgressConversationService;

  constructor(
    getConversationTwilio: GetConversationTwilio,
    createConversationService: CreateConversationService,
    getResponseByAccountService: GetResponseByAccountService,
    sendMessageWhatsappService: SendMessageWhatsappService,
    getUserNameConversation: GetUserNameConversation,
    getLastMessageInProgressConversationService: GetLastMessageInProgressConversationService,
  ) {
    this.getConversationTwilio = getConversationTwilio;
    this.createConversationService = createConversationService;
    this.getResponseByAccountService = getResponseByAccountService;
    this.sendMessageWhatsappService = sendMessageWhatsappService;
    this.getUserNameConversation = getUserNameConversation;
    this.getLastMessageInProgressConversationService =
      getLastMessageInProgressConversationService;
  }

  async execute(message: IConversationTwilio): Promise<string> {
    const senderConversationEntity: ConversationEntity =
      await this.getConversationTwilio.execute(message);

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

    const reply = await this.getResponseByAccountService.execute(
      senderConversationEntity.accountId,
    );
    const {options = [], response, step} = reply;

    const name = await this.getUserNameConversation.execute(
      senderConversationEntity.accountId,
    );

    const botAnswer: ConversationEntity = {
      fromPhone: Number(FlowContext.BOT_NUMBER),
      toPhone: senderConversationEntity.fromPhone,
      body: response,
      accountId: senderConversationEntity.accountId,
      messageId: senderConversationEntity.messageId,
      name: name || '',
      state: step === FlowContext.LAST_ITERATION ? 'FINISHED' : 'IN_PROGRESS',
      options,
      step,
      protocol: senderConversationEntity.protocol,
    };

    await this.sendMessageWhatsappService.execute(botAnswer);

    await this.createConversationService.execute(botAnswer);

    return response;
  }
}
