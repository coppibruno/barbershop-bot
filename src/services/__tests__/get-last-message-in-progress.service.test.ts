import * as Service from '../get-last-message-in-progress.service';
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

  const sut = new Service.GetLastMessageInProgressConversationService(
    findConversationsServiceStub,
  );
  return {sut, findConversationsServiceStub, conversationRepositoryStub};
};
const phone = 5599999999;
describe('Get Last Message In Progress Service', () => {
  test('should return last message ', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    const spyOn = jest.spyOn(findConversationsServiceStub, 'findOne');
    const adminPhone = 55111111111;

    jest.replaceProperty(sut, 'adminNumber', adminPhone);
    const result = await sut.execute(phone);

    expect(spyOn).toBeCalledWith({
      where: {
        fromPhone: adminPhone,
        toPhone: phone,
        state: 'IN_PROGRESS',
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
    const adminPhone = 55111111111;

    jest.replaceProperty(sut, 'adminNumber', adminPhone);

    const result = await sut.execute(phone);

    expect(spyOn).toBeCalledWith({
      where: {
        fromPhone: adminPhone,
        toPhone: phone,
        state: 'IN_PROGRESS',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toBe(null);
  });
});
