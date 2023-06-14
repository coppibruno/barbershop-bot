import {faker} from '@faker-js/faker';
import {Meetings} from '@prisma/client';
import {MeetingEntity} from '@/entity';

export const fakeMeeting = (params?: Partial<MeetingEntity>): Meetings => ({
  id: 'any_id',
  name: 'any_name',
  startDate: faker.date.recent(),
  endDate: faker.date.recent(),
  phone: 999999999,
  createdAt: faker.date.past(),
  disabledByAdmin: false,
});
