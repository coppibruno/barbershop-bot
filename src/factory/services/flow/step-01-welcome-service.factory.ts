import {StepWelcomeFlow} from '../../../services/flow';

export const WelcomeFlowServiceFactory = (): StepWelcomeFlow => {
  return new StepWelcomeFlow();
};
