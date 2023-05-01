import express, {Request, Response} from 'express';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';

import {preventInvalidRequest} from '../middlewares/isVaidRequest';
import {SendMessageWhatsappServiceFactory} from '../factory/services';
import {FlowConversationServiceFactory} from '../factory/services/flow-conversation-service.factory';

export const messageRouter = express.Router();

messageRouter.get('/fluxo', async (req: Request, res: Response) => {});

messageRouter.post('/send-message', async (req: Request, res: Response) => {
  try {
    const message = req.body.message;
    const api = SendMessageWhatsappServiceFactory();

    const result = await api.execute(message);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

messageRouter.post(
  '/listen-messages',
  preventInvalidRequest,
  async (req: Request, res: Response) => {
    try {
      const twiml = new MessagingResponse();

      const flowConversationService = FlowConversationServiceFactory();

      const data = req.body;

      await flowConversationService.execute(data);

      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
);
