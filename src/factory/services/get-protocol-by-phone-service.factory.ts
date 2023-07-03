import {GetProtocolByPhoneConversation} from '@/services';
import {FindConversationsServiceFactory} from './find-conversations-service.factory';

export const GetProtocolByPhoneServiceFactory =
  (): GetProtocolByPhoneConversation => {
    const findConversationsService = FindConversationsServiceFactory();

    return new GetProtocolByPhoneConversation(findConversationsService);
  };
