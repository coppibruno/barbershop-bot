import {faker} from '@faker-js/faker';
import {Meetings} from '@prisma/client';

export const fakeMeeting = (): Meetings => ({
  id: 'any_id',
  name: 'any_name',
  startDate: faker.date.recent(),
  endDate: faker.date.recent(),
  phone: 999999999,
  createdAt: faker.date.past(),
});
