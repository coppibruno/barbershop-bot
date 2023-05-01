import {ConversationEntity} from '../../entity/conversation';
import {IConversationTwilio} from '../../interfaces/external';
import {FindConversationsService} from '../../services/find-conversation.service';

/**
 * Classe responsável por tratar dados de integração de whatsapp do twilio para a entitidade
 */
export class GetConversationTwilio {
  constructor(
    private readonly findConversationsService: FindConversationsService,
  ) {}

  async execute(
    iConversationTwilio: IConversationTwilio,
  ): Promise<ConversationEntity> {
    const toPhone = iConversationTwilio.To.replace('whatsapp:+', '');
    const fromPhone = iConversationTwilio.From.replace('whatsapp:+', '');
    const accountId = iConversationTwilio.AccountSid;

    const conversationEntity: ConversationEntity = {
      name: null,
      fromPhone: Number(fromPhone),
      toPhone: Number(toPhone),
      body: iConversationTwilio.Body,
      messageId: iConversationTwilio.MessageSid,
      step: null,
      accountId,
    };

    return conversationEntity;
  }
}
