import {TwilioSendWhatsappMessageStub, fakeConversation} from '@/__mocks__';
import * as Service from '../send-message.service';

describe('Send Message Service', () => {
  test('should call external service with correct value', async () => {
    const twilioSendWhatsappMessageStub = new TwilioSendWhatsappMessageStub();

    const exec = new Service.SendMessageWhatsappService(
      twilioSendWhatsappMessageStub,
    );

    const conversation = fakeConversation();

    const spyOn = jest.spyOn(twilioSendWhatsappMessageStub, 'sendMessage');
    await exec.execute(conversation);

    expect(spyOn).toBeCalledWith(conversation);
  });
});
