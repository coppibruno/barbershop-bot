//services
import {GetStepConversationServiceFactory} from '../';
import {GetAdminResponseByAccountService} from '@/services/admin';

import {
  WelcomeAdminAndShowMenuFactory,
  AdminRunOptionFactory,
  AdminRunOptionPersistsFactory,
  AdminResponseByOptionMenuFactory,
} from './';

export const GetAdminResponseByAccountServiceFactory =
  (): GetAdminResponseByAccountService => {
    const getStepConversation = GetStepConversationServiceFactory();
    const stepWelcomeAdminAndShowMenu = WelcomeAdminAndShowMenuFactory();
    const stepAdminRunOption = AdminRunOptionFactory();
    const stepAdminRunOptionPersists = AdminRunOptionPersistsFactory();
    const stepAdminResponseByOptionMenu = AdminResponseByOptionMenuFactory();

    return new GetAdminResponseByAccountService(
      getStepConversation,
      stepWelcomeAdminAndShowMenu,
      stepAdminRunOption,
      stepAdminRunOptionPersists,
      stepAdminResponseByOptionMenu,
    );
  };
