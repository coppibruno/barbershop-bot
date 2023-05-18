import * as Step from '../step-03-response-by-option-menu.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  fakeConversation,
} from '../../__tests__/__mocks__/';
import {InvalidMenuOptionError} from '../../../errors';

describe('Step Response By Option Menu', () => {
  test('should return message to schedule an appointment and step 3', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();
    const findConversationsServiceStub = new FindConversationsServiceStub(
      conversationRepositoryStub,
    );
    const accountId = 'any_value';
    const menu = new Step.StepResponseByOptionMenuFlow(
      findConversationsServiceStub,
    );

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: '1'})),
      );
    const result = await menu.execute(accountId);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.response).toBe(menu.messageToMakeAppointment);
    expect(result.step).toBe(menu.stepCompleted); //step 3
  });
  test('should return message to rename user and step 1', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();
    const findConversationsServiceStub = new FindConversationsServiceStub(
      conversationRepositoryStub,
    );
    const accountId = 'any_value';
    const menu = new Step.StepResponseByOptionMenuFlow(
      findConversationsServiceStub,
    );

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: '2'})),
      );
    const result = await menu.execute(accountId);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.response).toBe(menu.messageToRenameUser);
    expect(result.step).toBe(menu.stepRenameUser); // step 1
  });
  test('should return previous step (2) if invalid menu is provided', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();
    const findConversationsServiceStub = new FindConversationsServiceStub(
      conversationRepositoryStub,
    );

    const accountId = 'any_value';

    const menu = new Step.StepResponseByOptionMenuFlow(
      findConversationsServiceStub,
    );

    jest
      .spyOn(menu, 'getOptionMenu')
      .mockImplementationOnce(() => Promise.resolve(8)); //option 8 does not exists

    const result = await menu.execute(accountId);
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(fakeConversation()));

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.step).toBe(menu.incompleteStep);
    expect(result.response).toBe(InvalidMenuOptionError.INVALID_MENU_OPTION);
  });
  test('should return try again if invalid type option is provided', async () => {
    const conversationRepositoryStub = new ConversationRepositoryStub();
    const findConversationsServiceStub = new FindConversationsServiceStub(
      conversationRepositoryStub,
    );
    const accountId = 'any_value';
    const menu = new Step.StepResponseByOptionMenuFlow(
      findConversationsServiceStub,
    );
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: 'invalid_option_provided'})),
      );
    const result = await menu.execute(accountId);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.step).toBe(menu.incompleteStep);
    expect(result.response).toBe(InvalidMenuOptionError.INVALID_MENU_OPTION);
  });
});
