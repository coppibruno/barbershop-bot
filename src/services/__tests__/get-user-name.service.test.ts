import * as Service from '../get-user-name.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  fakeConversation,
} from '@/__mocks__';

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();

  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const sut = new Service.GetUserNameConversation(findConversationsServiceStub);
  return {sut, conversationRepositoryStub, findConversationsServiceStub};
};

describe('Get User Name Service', () => {
  test('should return user name on success', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: 'any_name'})),
      );

    const result = await sut.execute('fake_account_id');

    expect(result).toBe('any_name');
  });
  test('should return null if not exists conversation by account', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(null));

    const result = await sut.execute('fake_account_id');

    expect(result).toBe(null);
  });
});
