import {FlowContext} from '../../flow.context';
import {IFlowResult} from '../../interfaces/flow';

export class StepWelcomeFlow {
  constructor() {}

  execute(): IFlowResult {
    return {response: FlowContext.WELCOME, step: 1};
  }
}
