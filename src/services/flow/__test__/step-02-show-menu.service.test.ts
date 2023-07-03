import * as Step from '../step-02-show-menu.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  GetUserNameConversationStub,
  fakeConversation,
} from '@/__mocks__';

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
const phone = 5599999999;
describe('Step Show Menu', () => {
  test('should return menu from user and step 2', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    const getUser = jest.spyOn(sut, 'getUser');

    const result = await sut.execute(phone);

    jest
      .spyOn(findConversationsServiceStub, 'execute')
      .mockImplementationOnce(() => Promise.resolve(fakeConversation()));

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(getUser).toBeCalledWith(phone);
    expect(result.step).toBe(2);
  });
});
