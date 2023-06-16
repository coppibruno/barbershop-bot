import {IFlowResult} from '@/interfaces/flow';
import {StepResponseByOptionMenuFlow} from '@/services/flow/step-03-response-by-option-menu.service';
import {FindConversationsServiceStub} from '@/__mocks__';
import {typeMenuUser} from '@/flow.context';

export class StepResponseByOptionMenuFlowStub extends StepResponseByOptionMenuFlow {
  private readonly findConversationServiceStub: FindConversationsServiceStub;

  constructor(findConversationServiceStub: FindConversationsServiceStub) {
    super(findConversationServiceStub);
  }

  replyByMenu(option: number): typeMenuUser {
    return typeMenuUser.APPOINTMENT;
  }

  async getOptionMenu(accountId: string): Promise<number> {
    return Promise.resolve(1);
  }

  async execute(accountId: string): Promise<IFlowResult> {
    return Promise.resolve({
      response: 'message_step_3',
      step: 3,
    });
  }
}
