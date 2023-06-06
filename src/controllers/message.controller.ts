import express, {Request, Response} from 'express';

import {preventInvalidRequest} from '@/middlewares/is-vaild-request.middleware';
import {SendMessageWhatsappServiceFactory} from '@/factory/services';
import {FlowConversationServiceFactory} from '@/factory/services/flow-conversation-service.factory';

export const messageRouterController = express.Router();

messageRouterController.post(
  '/send-message',
  async (req: Request, res: Response) => {
    try {
      const message = req.body.message;
      const api = SendMessageWhatsappServiceFactory();

      const result = await api.execute(message);

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
);

messageRouterController.post(
  '/listen-messages',
  preventInvalidRequest,
  async (req: Request, res: Response) => {
    try {
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
