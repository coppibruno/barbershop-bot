import * as Step from '../step-02-show-menu.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  GetUserNameConversationStub,
  fakeConversation,
  GetProtocolByPhoneConversationStub,
} from '@/__mocks__';

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );
  const getUserNameStub = new GetUserNameConversationStub(
    findConversationsServiceStub,
  );

  const getProtocolByPhoneConversationStub =
    new GetProtocolByPhoneConversationStub(findConversationsServiceStub);

  const sut = new Step.StepShowMenuFlow(
    getUserNameStub,
    getProtocolByPhoneConversationStub,
  );
  return {
    sut,
    getProtocolByPhoneConversationStub,
    conversationRepositoryStub,
    findConversationsServiceStub,
  };
};
const phone = 5599999999;
describe('Step Show Menu', () => {
  test('should return menu from user and step 2', async () => {
    const {
      sut,
      getProtocolByPhoneConversationStub,
      findConversationsServiceStub,
    } = makeSut();

    const spyOn = jest.spyOn(getProtocolByPhoneConversationStub, 'execute');

    const result = await sut.execute(phone);

    jest
      .spyOn(findConversationsServiceStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(fakeConversation()));

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(spyOn).toBeCalledWith(phone);
    expect(result.step).toBe(2);
  });
});
