import {FlowContext} from '../../flow.context';
import {IFlowResult} from '../../interfaces/flow';
/**
 * Etapa responsável por dar boas vindas ao cliente
 */
export class StepWelcomeFlow {
  execute(): IFlowResult {
    return {response: FlowContext.WELCOME, step: 1};
  }
}
