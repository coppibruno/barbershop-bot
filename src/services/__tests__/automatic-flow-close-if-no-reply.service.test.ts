import {faker} from '@faker-js/faker';
import {TwilioSendWhatsappMessageStub} from '@/__mocks__/external/twilio-send-whatsapp-message.mock';
import * as Service from '../automatic-flow-close-if-no-reply.service';
import {
  ConversationRepositoryStub,
  FindConversationsServiceStub,
  CreateConversationServiceStub,
  SendMessageWhatsappServiceStub,
  fakeConversation,
} from '@/__mocks__';
import {FlowContext} from '../../flow.context';

const makeSut = () => {
  const conversationRepositoryStub = new ConversationRepositoryStub();
  const createConversationServiceStub = new CreateConversationServiceStub(
    conversationRepositoryStub,
  );

  const twilioSendWhatsappMessageStub = new TwilioSendWhatsappMessageStub();
  const sendMessageWhatsappServiceStub = new SendMessageWhatsappServiceStub(
    twilioSendWhatsappMessageStub,
  );
  const findConversationsServiceStub = new FindConversationsServiceStub(
    conversationRepositoryStub,
  );

  const sut = new Service.AutomaticFlowCloseIfNoReplyService(
    conversationRepositoryStub,
    createConversationServiceStub,
    sendMessageWhatsappServiceStub,
    findConversationsServiceStub,
  );

  return {
    sut,
    conversationRepositoryStub,
    createConversationServiceStub,
    sendMessageWhatsappServiceStub,
    findConversationsServiceStub,
  };
};

const fakeChatToBeClosed = () => ({
  _max: {
    createdAt: faker.date.recent({days: 1}),
  },
  fromPhone: faker.number.int({min: 111111111, max: 999999999}),
  protocol: faker.number.int({min: 21252}),
});

const mockedTime = faker.date.future();

jest.spyOn(Service, 'getDurationInHours').mockImplementationOnce(() => 1);
jest
  .spyOn(Service, 'setMoment')
  .mockImplementationOnce(() => mockedTime as any);

describe('AutomaticFlowCloseIfNoReplyService', () => {
  test('should send message with close service if hours is more than 1', async () => {
    const {
      sut,
      conversationRepositoryStub,
      createConversationServiceStub,
      sendMessageWhatsappServiceStub,
    } = makeSut();

    jest
      .spyOn(conversationRepositoryStub, 'getGroupedByPhone')
      .mockImplementationOnce(() =>
        Promise.resolve([
          fakeChatToBeClosed(),
          fakeChatToBeClosed(),
          fakeChatToBeClosed(),
          fakeChatToBeClosed(),
        ]),
      );

    const createConversationSpy = jest.spyOn(
      createConversationServiceStub,
      'execute',
    );
    const sendMessageSpy = jest.spyOn(
      sendMessageWhatsappServiceStub,
      'execute',
    );

    await sut.execute();
    expect(createConversationSpy).toBeCalledWith(
      expect.objectContaining({
        body: 'Estamos encerrando o atendimento. \n' + FlowContext.GOODBYE,
      }),
    );
    expect(sendMessageSpy).toBeCalledWith(
      expect.objectContaining({
        body: 'Estamos encerrando o atendimento. \n' + FlowContext.GOODBYE,
      }),
    );
  });
  test('should not send message if its hours less than 1 hr ', async () => {
    jest.resetAllMocks();

    const {
      sut,
      conversationRepositoryStub,
      createConversationServiceStub,
      sendMessageWhatsappServiceStub,
    } = makeSut();

    jest
      .spyOn(conversationRepositoryStub, 'getGroupedByPhone')
      .mockImplementationOnce(() =>
        Promise.resolve([
          fakeChatToBeClosed(),
          fakeChatToBeClosed(),
          fakeChatToBeClosed(),
          fakeChatToBeClosed(),
        ]),
      );

    jest.spyOn(Service, 'getDurationInHours').mockImplementation(() => 0);

    const createConversationSpy = jest.spyOn(
      createConversationServiceStub,
      'execute',
    );
    const sendMessageSpy = jest.spyOn(
      sendMessageWhatsappServiceStub,
      'execute',
    );

    await sut.execute();
    expect(createConversationSpy).not.toBeCalled();
    expect(sendMessageSpy).not.toBeCalledWith();
  });
  test('should not send message if state is finished', async () => {
    const {
      sut,
      conversationRepositoryStub,
      createConversationServiceStub,
      sendMessageWhatsappServiceStub,
      findConversationsServiceStub,
    } = makeSut();

    jest
      .spyOn(conversationRepositoryStub, 'getGroupedByPhone')
      .mockImplementationOnce(() =>
        Promise.resolve([
          fakeChatToBeClosed(),
          fakeChatToBeClosed(),
          fakeChatToBeClosed(),
          fakeChatToBeClosed(),
        ]),
      );

    jest
      .spyOn(findConversationsServiceStub, 'findOne')
      .mockImplementation(() =>
        Promise.resolve(fakeConversation({state: 'FINISHED'})),
      );

    const createConversationSpy = jest.spyOn(
      createConversationServiceStub,
      'execute',
    );
    const sendMessageSpy = jest.spyOn(
      sendMessageWhatsappServiceStub,
      'execute',
    );

    await sut.execute();
    expect(createConversationSpy).not.toBeCalled();
    expect(sendMessageSpy).not.toBeCalledWith();
  });
});
