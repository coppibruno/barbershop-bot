import {ConversationEntity} from '../../entity/conversation';
import ResponseSendMessage from './response';

export interface SendWhatsappMessage {
  sendMessage(data: {
    from: number;
    body: string;
    to: number;
  }): Promise<ConversationEntity>;
}
