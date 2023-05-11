import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import {PrismaClient} from '@prisma/client';
import {messageRouterController} from './controllers';
import * as nodeCron from 'node-cron';
import {AutomaticFlowCloseIfNoReplyServiceFactory} from './factory/services/automatic-flow-close-if-no-reply-service.factory';

nodeCron.schedule('0 * * * *', async function () {
  const service = AutomaticFlowCloseIfNoReplyServiceFactory();
  await service.execute();
});

const prisma = new PrismaClient();

const port = process.env.PORT;

async function main() {
  // Connect the client
  await prisma.$connect();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/message', messageRouterController);

app.listen(port, async () => {
  console.log('Server running on port ' + port);
});
