import {faker} from '@faker-js/faker';
import {Conversations} from '@prisma/client';
import {ConversationEntity} from '@/entity';

export const fakeConversation = (
  params?: Partial<ConversationEntity>,
): Conversations => ({
  id: 'any_id',
  name: 'any_name',
  ...(params?.options ? {options: params.options} : {options: {}}),
  protocol: 94545315154,
  ...(params?.state ? {state: params.state} : {state: 'IN_PROGRESS'}),
  ...(params?.step ? {step: params.step} : {step: null}),
  accountId: 'any_account_id',
  ...(params?.body ? {body: params.body} : {body: 'any_body'}),
  createdAt: faker.date.recent(),
  ...(params?.fromPhone
    ? {fromPhone: params.fromPhone}
    : {fromPhone: 55999999999}),
  messageId: 'any_messageid',
  toPhone: 888888888,
});
