import ConversationRepository from '../repositories/conversationRepository';
import moment from 'moment-timezone';
import {CreateConversationService} from './create-conversation.service';
import {SendMessageWhatsappService} from './send-message.service';
import {ConversationEntity} from '../entity/conversationEntity';
import {FindConversationsService} from './find-conversation.service';
import {FlowContext} from '../flow.context';

export class AutomaticFlowCloseIfNoReplyService {
  private readonly serviceRepository;
  private readonly createConversationService: CreateConversationService;
  private readonly sendMessageWhatsappService: SendMessageWhatsappService;
  private readonly findConversationsService: FindConversationsService;

  constructor(
    serviceRepository: ConversationRepository,
    createConversationService: CreateConversationService,
    sendMessageWhatsappService: SendMessageWhatsappService,
    findConversationsService: FindConversationsService,
  ) {
    this.serviceRepository = serviceRepository;
    this.createConversationService = createConversationService;
    this.sendMessageWhatsappService = sendMessageWhatsappService;
    this.findConversationsService = findConversationsService;
  }

  async execute() {
    const chats = await this.serviceRepository.getGroupedByPhone();
    console.log(chats);
    for (const chat of chats) {
      const createdAt: Date | null = chat._max.createdAt;
      const fromPhone: number = chat.fromPhone;

      const lastIterationDate = moment(createdAt);
      const now = moment(new Date());

      const duration = moment.duration(now.diff(lastIterationDate));
      const hours = parseInt(String(duration.asHours()));

      if (hours >= 1) {
        const client = await this.findConversationsService.findOne({
          where: {
            fromPhone: fromPhone,
          },
        });
        if (client && client.state !== 'FINISHED') {
          const body =
            'Estamos encerrando o atendimento. \n' + FlowContext.GOODBYE;
          const botAutomaticReply: ConversationEntity = {
            accountId: client.accountId,
            body,
            fromPhone: Number(FlowContext.BOT_NUMBER),
            toPhone: fromPhone,
            messageId: client.messageId,
            name: client.name,
            step: FlowContext.LAST_ITERATION,
            options: client.options,
            state: 'FINISHED',
            protocol: client.protocol,
          };

          await this.createConversationService.execute(botAutomaticReply);
          await this.sendMessageWhatsappService.execute(botAutomaticReply);
        }
      }
    }
  }
}
