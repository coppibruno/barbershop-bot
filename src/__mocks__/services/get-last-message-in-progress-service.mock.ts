import {Conversations} from '@prisma/client';
import {GetLastMessageInProgressConversationService} from '@/services/get-last-message-in-progress.service';
import {FindConversationsServiceStub} from './find-conversation-service.mock';
import {fakeConversation} from '../entities/faker-conversation.mock';

/**
 * Busca a ultima mensagem e retorna caso não tenha sido finalizada
 */
export class GetLastMessageInProgressConversationServiceStub extends GetLastMessageInProgressConversationService {
  private readonly findConversationServiceStub: FindConversationsServiceStub;

  constructor(findConversationServiceStub: FindConversationsServiceStub) {
    super(findConversationServiceStub);
  }
  async execute(phone: number): Promise<Conversations | null> {
    return fakeConversation();
  }
}
