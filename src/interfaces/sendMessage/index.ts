import ResponseSendMessage from './response';

export interface SendWhatsappMessage {
  sendMessage(body: string): Promise<ResponseSendMessage>;
}
