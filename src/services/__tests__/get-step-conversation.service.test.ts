import {FlowContext} from '../../flow.context';
import * as Service from '../get-step-conversation.service';
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

  const sut = new Service.GetStepConversation(findConversationsServiceStub);
  return {sut, conversationRepositoryStub, findConversationsServiceStub};
};
const phone = 5599999999;
describe('Get Step Conversation Service', () => {
  test('should return next step', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({step: 1})),
      );
    const spyOn = jest.spyOn(findConversationsServiceStub, 'findOne');
    const result = await sut.execute(phone);

    expect(spyOn).toBeCalledWith({
      where: {
        toPhone: phone,
        fromPhone: Number(FlowContext.BOT_NUMBER),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toBe(2);
  });
  test('should return first step if state is finished', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({state: 'FINISHED'})),
      );
    const spyOn = jest.spyOn(findConversationsServiceStub, 'findOne');
    const result = await sut.execute(phone);
    expect(spyOn).toBeCalledWith({
      where: {
        toPhone: phone,
        fromPhone: Number(FlowContext.BOT_NUMBER),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toBe(1);
  });
  test('should return first step if conversation not found', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(null));

    const spyOn = jest.spyOn(findConversationsServiceStub, 'findOne');

    const result = await sut.execute(phone);
    expect(spyOn).toBeCalledWith({
      where: {
        toPhone: phone,
        fromPhone: Number(FlowContext.BOT_NUMBER),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toBe(1);
  });
});
