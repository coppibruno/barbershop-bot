import {ConversationEntity} from '../../entity/conversation';
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
      name: null,
      fromPhone: Number(fromPhone),
      toPhone: Number(toPhone),
      body: iConversationTwilio.Body,
      messageId: iConversationTwilio.MessageSid,
      accountId,
    };

    return conversationEntity;
  }
}
