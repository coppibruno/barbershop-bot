import {GetLastMessageInProgressConversationService} from '../../services/get-last-message-in-progress.service';
import {FindConversationsServiceFactory} from './find-conversations-service.factory';

export const GetLastMessageInProgressServiceFactory =
  (): GetLastMessageInProgressConversationService => {
    const findConversationsService = FindConversationsServiceFactory();

    return new GetLastMessageInProgressConversationService(
      findConversationsService,
    );
  };
