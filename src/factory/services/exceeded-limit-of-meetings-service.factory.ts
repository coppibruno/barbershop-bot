import {ExceededLimitOfMeetingsService} from '@/services/exceeded-limit-of-meetings.service';
import {MeetingRepository} from '../../repositories/meeting.repository';
import {GetPhoneByAccountIdConversation} from '@/services';
import {FindConversationsServiceFactory} from './find-conversations-service.factory';

export const ExceededLimitOfMeetingsServiceFactory =
  (): ExceededLimitOfMeetingsService => {
    const meetingRepository = new MeetingRepository();
    const findConversationService = FindConversationsServiceFactory();
    const getPhoneByAccountIdConversation = new GetPhoneByAccountIdConversation(
      findConversationService,
    );

    return new ExceededLimitOfMeetingsService(
      meetingRepository,
      getPhoneByAccountIdConversation,
    );
  };
