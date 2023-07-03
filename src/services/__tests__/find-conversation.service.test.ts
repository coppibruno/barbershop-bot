import * as Service from '../find-conversation.service';
import {ConversationRepositoryStub, fakeConversation} from '@/__mocks__';

const phone = 5599999999;

describe('Find Conversation Service', () => {
  test('should return a list of conversationEntity', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();

    const create = new Service.FindConversationsService(
      conversationRepositoryStub,
    );
    const spyOn = jest.spyOn(conversationRepositoryStub, 'find');

    const exec = await create.find({
      where: {
        fromPhone: phone,
      },
    });

    expect(exec).toBeDefined();
    expect(spyOn).toBeCalledWith({
      where: {
        fromPhone: phone,
      },
    });
    expect(exec.length).toBe(2);
  });
  test('should return a conversation', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();

    const create = new Service.FindConversationsService(
      conversationRepositoryStub,
    );
    const spyOn = jest.spyOn(conversationRepositoryStub, 'findOne');

    const exec = await create.findOne({
      where: {
        accountId: 'fake_account_id',
      },
    });

    expect(exec).toBeDefined();
    expect(spyOn).toBeCalledWith({
      where: {
        accountId: 'fake_account_id',
      },
    });
  });
});
