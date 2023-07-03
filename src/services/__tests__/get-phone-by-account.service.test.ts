import * as Service from '../get-protocol-by-phone.service';
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

  const sut = new Service.GetPhoneByAccountIdConversation(
    findConversationsServiceStub,
  );
  return {sut, conversationRepositoryStub, findConversationsServiceStub};
};
const phone = 5599999999;
describe('GetPhoneByAccount', () => {
  test('should return phone on success', async () => {
    const {sut, findConversationsServiceStub} = makeSut();
    const expectedPhone = 99999999;
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({fromPhone: expectedPhone})),
      );

    const result = await sut.execute('fake_account_id');

    expect(result).toBe(expectedPhone);
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
