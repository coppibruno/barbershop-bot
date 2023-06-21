import {AdminResponseByOptionMenu} from '@/services/admin';
import {FindConversationsServiceFactory} from '../find-conversations-service.factory';

export const AdminResponseByOptionMenuFactory =
  (): AdminResponseByOptionMenu => {
    const findConversationService = FindConversationsServiceFactory();

    return new AdminResponseByOptionMenu(findConversationService);
  };
