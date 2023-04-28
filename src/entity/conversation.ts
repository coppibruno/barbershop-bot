import {Conversations} from '@prisma/client';

export type ConversationEntity = Omit<Conversations, 'id' | 'createdAt'>;
