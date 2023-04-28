import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import {Router, Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

import {messageRouter} from './controllers';
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

const route = Router();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

route.get('/hello-world', (req: Request, res: Response) => {
  res.send('hello');
});

app.use('/message', messageRouter);

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
