import * as Service from '../create-conversation.service';
import {ConversationRepositoryStub, fakeConversation} from '@/__mocks__';

describe('Create Conversation Service', () => {
  test('should create conversation', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();

    const create = new Service.CreateConversationService(
      conversationRepositoryStub,
    );
    const conversationEntity = fakeConversation();
    const spyOn = jest.spyOn(conversationRepositoryStub, 'create');

    const exec = await create.execute(conversationEntity);

    expect(exec).toBeDefined();
    expect(spyOn).toBeCalledWith(conversationEntity);
    expect(exec).toHaveProperty('id');
  });
});
