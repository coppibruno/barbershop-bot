import * as Step from '../step-02-show-menu.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  GetUserNameConversationStub,
  fakeConversation,
} from '../../__tests__/__mocks__/';

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );
  const getUserNameStub = new GetUserNameConversationStub(
    findConversationsServiceStub,
  );

  const sut = new Step.StepShowMenuFlow(getUserNameStub);
  return {sut, conversationRepositoryStub, findConversationsServiceStub};
};

describe('Step Show Menu', () => {
  test('should return menu from user and step 2', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    const accountId = 'any_value';

    const getUser = jest.spyOn(sut, 'getUser');

    const result = await sut.execute(accountId);

    jest
      .spyOn(findConversationsServiceStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(fakeConversation()));

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(getUser).toBeCalledWith(accountId);
    expect(result.step).toBe(2);
  });
});
