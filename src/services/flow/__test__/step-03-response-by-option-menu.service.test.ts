import * as Step from '../step-03-response-by-option-menu.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  fakeConversation,
} from '@/__mocks__';
import {InvalidMenuOptionError} from '../../../errors';

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );
  const sut = new Step.StepResponseByOptionMenuFlow(
    findConversationsServiceStub,
  );
  return {sut, conversationRepositoryStub, findConversationsServiceStub};
};
const phone = 5599999999;
describe('Step Response By Option Menu', () => {
  test('should return message to schedule an appointment and step 3', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: '1'})),
      );
    const result = await sut.execute(phone);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.response).toBe(sut.messageToMakeAppointment);
    expect(result.step).toBe(sut.stepCompleted); //step 3
  });
  test('should return message to rename user and step 1', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: '2'})),
      );
    const result = await sut.execute(phone);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.response).toBe(sut.messageToRenameUser);
    expect(result.step).toBe(sut.stepRenameUser); // step 1
  });
  test('should return previous step (2) if invalid menu is provided', async () => {
    const {sut, findConversationsServiceStub} = makeSut();

    jest
      .spyOn(sut, 'getOptionMenu')
      .mockImplementationOnce(() => Promise.resolve(8)); //option 8 does not exists

    const result = await sut.execute(phone);
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(fakeConversation()));

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.step).toBe(sut.incompleteStep);
    expect(result.response).toBe(InvalidMenuOptionError.INVALID_MENU_OPTION);
  });
  test('should return try again if invalid type option is provided', async () => {
    const {sut, findConversationsServiceStub} = makeSut();
    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(fakeConversation({body: 'invalid_option_provided'})),
      );
    const result = await sut.execute(phone);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');
    expect(result.step).toBe(sut.incompleteStep);
    expect(result.response).toBe(InvalidMenuOptionError.INVALID_MENU_OPTION);
  });
});
