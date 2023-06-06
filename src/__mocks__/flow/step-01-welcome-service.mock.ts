import {IFlowResult} from '@/interfaces/flow';
import {StepWelcomeFlow} from '@/services/flow/step-01-welcome.service';
/**
 * Etapa responsável por dar boas vindas ao cliente
 */
export class StepWelcomeFlowStub extends StepWelcomeFlow {
  execute(): IFlowResult {
    return {response: 'message_step_1', step: 1};
  }
}
