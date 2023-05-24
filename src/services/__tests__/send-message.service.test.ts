import {TwilioSendWhatsappMessageStub} from '../../external/__mocks__/twilio-send-whatsapp-message.mock';
import * as Service from '../send-message.service';
import {fakeConversation} from './__mocks__';

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
