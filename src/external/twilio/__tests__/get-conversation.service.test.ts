import {IConversationTwilio} from '../../../interfaces';
import * as Service from '../get-conversation';

describe('Get Conversation Twilio Service', () => {
  test('should return conversation entity on success', () => {
    const data: IConversationTwilio = {
      AccountSid: 'any_account',
      Body: 'any_body',
      From: '555555555',
      MessageSid: 'any_message',
      To: '9999999',
    };

    const result = new Service.GetConversationTwilio().execute(data);
    expect(result.accountId).toEqual('any_account');
    expect(result.body).toEqual('any_body');
    expect(result.fromPhone).toEqual(555555555);
    expect(result.messageId).toEqual('any_message');
    expect(result.toPhone).toEqual(9999999);
  });
});
