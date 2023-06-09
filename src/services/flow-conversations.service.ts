import {ConversationEntity} from '@/entity/conversation.entity';

import {GetConversationTwilio} from '@/external/twilio/get-conversation';

import {FlowContext} from '../flow.context';

import {IConversationTwilio} from '@/interfaces/external';

//services
import {
  CreateConversationService,
  GetLastMessageInProgressConversationService,
  GetResponseByAccountService,
  GetUserNameConversation,
  SendMessageWhatsappService,
} from '@/services';
import {FlowAdminConversationService} from './admin';
import {ExceededLimitOfMeetingsService} from './exceeded-limit-of-meetings.service';

/**
 * Responsável pelo fluxo de receber mensagem do usuário, persistir, processar e buscar dados, retornar a mensagem do assistênte virtual
 */
export class FlowConversationService {
  public adminNumber = FlowContext.ADMIN_NUMBER;

  constructor(
    private readonly getConversationTwilio: GetConversationTwilio,
    private readonly createConversationService: CreateConversationService,
    private readonly getResponseByAccountService: GetResponseByAccountService,
    private readonly sendMessageWhatsappService: SendMessageWhatsappService,
    private readonly getUserNameConversation: GetUserNameConversation,
    private readonly getLastMessageInProgressConversationService: GetLastMessageInProgressConversationService,
    private readonly flowAdminConversationService: FlowAdminConversationService,
    private readonly exceededLimitOfMeetingsService: ExceededLimitOfMeetingsService,
  ) {
    this.getConversationTwilio = getConversationTwilio;
    this.createConversationService = createConversationService;
    this.getResponseByAccountService = getResponseByAccountService;
    this.sendMessageWhatsappService = sendMessageWhatsappService;
    this.getUserNameConversation = getUserNameConversation;
    this.getLastMessageInProgressConversationService =
      getLastMessageInProgressConversationService;
    this.flowAdminConversationService = flowAdminConversationService;
    this.exceededLimitOfMeetingsService = exceededLimitOfMeetingsService;
  }

  private isAdminUser(phone: number): boolean {
    return phone === this.adminNumber;
  }

  async execute(message: IConversationTwilio): Promise<string> {
    const senderConversationEntity: ConversationEntity =
      this.getConversationTwilio.execute(message);

    const notAllowed = await this.exceededLimitOfMeetingsService.execute(
      senderConversationEntity.accountId,
    );
    if (notAllowed) {
      console.error(`phone ${senderConversationEntity.fromPhone} not allowed`);
      return;
    }

    if (this.isAdminUser(senderConversationEntity.fromPhone)) {
      return await this.flowAdminConversationService.execute(message);
    }

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
