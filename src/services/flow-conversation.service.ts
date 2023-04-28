import {ConversationEntity} from '../entity/conversation';
import {GetConversationTwilio} from '../external/twilio/get-conversation';
import {IConversationTwilio} from '../interfaces/external';
import ConversationRepository from '../repositories/conversationRepository';
import {CreateConversationService} from './create-conversation.service';
import {GetResponseByAccountService} from './get-response-by-account.service';

export class FlowConversationService {
  private readonly getConversationTwilio;
  private readonly createConversationService;
  private readonly getResponseByAccountService;

  constructor(
    getConversationTwilio: GetConversationTwilio,
    createConversationService: CreateConversationService,
    getResponseByAccountService: GetResponseByAccountService,
  ) {
    this.getConversationTwilio = getConversationTwilio;
    this.createConversationService = createConversationService;
    this.getResponseByAccountService = getResponseByAccountService;
  }

  async execute(message: IConversationTwilio): Promise<any> {
    const conversationEntity: ConversationEntity =
      await this.getConversationTwilio.execute(message);

    const conversationModel = await this.createConversationService.execute(
      conversationEntity,
    );

    this.getResponseByAccountService.execute();
  }
}
