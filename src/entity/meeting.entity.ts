import {Meetings} from '@prisma/client';

export type MeetingEntity = Omit<Meetings, 'id' | 'createdAt'>;
