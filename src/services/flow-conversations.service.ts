import {ConversationEntity} from '../entity/conversationEntity';
import {GetConversationTwilio} from '../external/twilio/get-conversation';
import {IConversationTwilio} from '../interfaces/external';
import {CreateConversationService} from './create-conversation.service';
import {GetResponseByAccountService} from './get-response-by-account.service';
import {SendMessageWhatsappService} from './send-message.service';
import 'dotenv/config';
const BOT_NUMBER = process.env.BOT_NUMBER;

export class FlowConversationService {
  private readonly getConversationTwilio;
  private readonly createConversationService;
  private readonly getResponseByAccountService;
  private readonly sendMessageWhatsappService;

  constructor(
    getConversationTwilio: GetConversationTwilio,
    createConversationService: CreateConversationService,
    getResponseByAccountService: GetResponseByAccountService,
    sendMessageWhatsappService: SendMessageWhatsappService,
  ) {
    this.getConversationTwilio = getConversationTwilio;
    this.createConversationService = createConversationService;
    this.getResponseByAccountService = getResponseByAccountService;
    this.sendMessageWhatsappService = sendMessageWhatsappService;
  }

  async execute(message: IConversationTwilio): Promise<string> {
    const senderConversationEntity: ConversationEntity =
      await this.getConversationTwilio.execute(message);

    await this.createConversationService.execute(senderConversationEntity);

    const reply = await this.getResponseByAccountService.execute(
      senderConversationEntity.accountId,
    );
    const {response, step} = reply;

    const botAnswer: ConversationEntity = {
      fromPhone: Number(BOT_NUMBER),
      toPhone: senderConversationEntity.fromPhone,
      body: response,
      accountId: senderConversationEntity.accountId,
      messageId: senderConversationEntity.messageId,
      name: senderConversationEntity.name,
      step,
    };

    await this.sendMessageWhatsappService.execute(botAnswer);

    await this.createConversationService.execute(botAnswer);

    return response;
  }
}
