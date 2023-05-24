import * as Service from '../get-last-message-in-progress.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  fakeConversation,
} from './__mocks__';

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();

  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const sut = new Service.GetLastMessageInProgressConversationService(
    findConversationsServiceStub,
  );
  return {sut, findConversationsServiceStub, conversationRepositoryStub};
};

describe('Get Last Message In Progress Service', () => {
  test('should return last message ', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    const spyOn = jest.spyOn(findConversationsServiceStub, 'findOne');

    const result = await sut.execute('fake_account_id');

    expect(spyOn).toBeCalledWith({
      where: {
        accountId: 'fake_account_id',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toHaveProperty('body');
  });
  test('should return null if not found conversation ', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    const spyOn = jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockReturnValueOnce(null);

    const result = await sut.execute('fake_account_id');

    expect(spyOn).toBeCalledWith({
      where: {
        accountId: 'fake_account_id',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toBe(null);
  });
  test('should return null if state is finished', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    const spyOn = jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({state: 'FINISHED'})),
      );

    const result = await sut.execute('fake_account_id');

    expect(spyOn).toBeCalledWith({
      where: {
        accountId: 'fake_account_id',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toBe(null);
  });
});
