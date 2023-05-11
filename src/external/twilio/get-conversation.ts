import {ConversationEntity} from '../../entity/conversationEntity';
import {IConversationTwilio} from '../../interfaces/external';

/**
 * Classe responsável por tratar dados de integração de whatsapp do twilio para a entitidade
 */
export class GetConversationTwilio {
  async execute(
    iConversationTwilio: IConversationTwilio,
  ): Promise<ConversationEntity> {
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
