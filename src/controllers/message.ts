import express, {Request, Response} from 'express';

import {TwilioSendWhatsappMessage} from '../external/twilio/send-new-message';
import {SendMessageWhatsappService} from '../services/send-message.service';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import {CreateConversationService} from '../services/create-conversation.service';
import ConversationRepository from '../repositories/conversationRepository';
import {ConversationEntity} from '../entity/conversation';
import {GetResponseByAccountService} from '../services/get-response-by-account.service';
import {randomUUID} from 'crypto';
import {preventInvalidRequest} from '../middlewares/isVaidRequest';
import {GetConversationTwilio} from '../external/twilio/get-conversation';
import {GetResponseByAccountServiceFactory} from '../factory/services/get-response-by-account-service.factory';
import {CreateConversationServiceFactory} from '../factory/services/create-conversation-service.factory';
import {FlowConversationService} from '../services/flow-conversation.service';

export const messageRouter = express.Router();

messageRouter.get('/fluxo', async (req: Request, res: Response) => {});

messageRouter.post('/send-message', async (req: Request, res: Response) => {
  try {
    const message = req.body.message;
    const externalService = new TwilioSendWhatsappMessage();
    const api = new SendMessageWhatsappService(externalService);

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

      const getResponseByAccountService = GetResponseByAccountServiceFactory();
      const createConversationService = CreateConversationServiceFactory();
      const getConversationTwilio = new GetConversationTwilio();

      const flowConversationService = new FlowConversationService(
        getConversationTwilio,
        createConversationService,
        getResponseByAccountService,
      );

      const data = req.body;

      return await flowConversationService.execute(data);

      const conversationEntity = GetConversationTwilio.execute(req.body);

      const conversationRepository = new ConversationRepository();
      const conversationService = new CreateConversationService(
        conversationRepository,
      );

      const getResponseService = new GetResponseByAccountService(
        conversationRepository,
      );

      const conversation = await conversationService.execute(
        conversationEntity,
      );
      const response = await getResponseService.execute(
        conversationEntity.accountId,
      );
      console.log(response);
      await twiml.message(response);

      const conversationResponse: ConversationEntity = {
        fromPhone: Number(toPhone),
        toPhone: Number(req.body.WaId),
        body: response,
        name: null,
        messageId: randomUUID(),
        accountId,
      };

      const saveResponse = await conversationService.execute(
        conversationResponse,
      );

      res.type('text/xml').send(twiml.toString());
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
);
