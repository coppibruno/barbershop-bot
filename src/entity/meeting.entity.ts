// import {Meetings} from '@prisma/client';
import {Prisma} from '@prisma/client';
// MeetingsCreateInput
export type MeetingEntity = Omit<
  Prisma.MeetingsCreateInput,
  'id' | 'createdAt'
>;
