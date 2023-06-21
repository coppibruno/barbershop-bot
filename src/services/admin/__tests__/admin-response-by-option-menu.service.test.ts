import {FlowContext} from '@/flow.context';
import * as Step from '../admin-response-by-option-menu.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  fakeConversation,
} from '@/__mocks__';

const accountId = 'faker_account_id';

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const sut = new Step.AdminResponseByOptionMenu(findConversationsServiceStub);
  return {sut, findConversationsServiceStub};
};

describe('Admin response by option menu service', () => {
  test('should return a callback message on select a menu', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: '1'})),
      );

    const result = await sut.execute(accountId);

    const findMenu = FlowContext.MENU_ADMIN.find((i) => i.option === 1);

    expect(result.response).toBe(findMenu.callback);
    expect(result.step).toBe(2);
  });
  test('should call previous service if error is occurred', async () => {
    const {sut} = makeSut();
    jest
      .spyOn(
        Step.AdminResponseByOptionMenu.prototype as any,
        'replyMenuRequest',
      )
      .mockImplementation(() => {
        throw new Error('fake error');
      });
    const result = await sut.execute(accountId);
    expect(result.response).toEqual(
      expect.stringMatching(FlowContext.ADMIN_WELCOME),
    );
    expect(result.step).toBe(1);
  });
});
