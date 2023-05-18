import * as Step from '../step-01-welcome.service';
import {FlowContext} from '../../../flow.context';

describe('Step Welcome Flow', () => {
  test('should return welcome message and step 1', () => {
    const result = new Step.StepWelcomeFlow().execute();

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('step');

    expect(result.response).toBe(FlowContext.WELCOME);
    expect(result.step).toBe(1);
  });
});
