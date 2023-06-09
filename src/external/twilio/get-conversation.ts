import {ConversationEntity} from '../../entity/conversation.entity';
import {IConversationTwilio} from '../../interfaces/external';

/**
 * Classe responsável por tratar dados de integração de whatsapp do twilio para a entitidade
 */
export class GetConversationTwilio {
  execute(iConversationTwilio: IConversationTwilio): ConversationEntity {
    const toPhone = iConversationTwilio.To.replace('whatsapp:+', '');
    const fromPhone = iConversationTwilio.From.replace('whatsapp:+', '');
    const accountId = iConversationTwilio.AccountSid;

    const conversationEntity: ConversationEntity = {
      name: '',
      fromPhone: Number(fromPhone),
      toPhone: Number(toPhone),
      body: iConversationTwilio.Body,
      messageId: iConversationTwilio.MessageSid,
      step: null,
      state: 'IN_PROGRESS',
      options: {},
      accountId,
      protocol: Date.now(),
    };

    return conversationEntity;
  }
}
