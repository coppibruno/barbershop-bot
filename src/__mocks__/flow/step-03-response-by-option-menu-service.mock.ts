import {IFlowResult} from '@/interfaces/flow';
import {StepResponseByOptionMenuFlow} from '@/services/flow/step-03-response-by-option-menu.service';
import {FindConversationsServiceStub} from '@/__mocks__';

enum ResponseOptionEnum {
  MAKE_APPOINTMENT = 'MAKE_APPOINTMENT',
  RENAME_USER = 'RENAME_USER',
  CLOSE_SERVICE = 'CLOSE_SERVICE',
  INVALID_OPTION = 'INVALID_OPTION',
}

export class StepResponseByOptionMenuFlowStub extends StepResponseByOptionMenuFlow {
  private readonly findConversationServiceStub: FindConversationsServiceStub;

  constructor(findConversationServiceStub: FindConversationsServiceStub) {
    super(findConversationServiceStub);
  }

  replyByMenu(option: number): ResponseOptionEnum {
    return ResponseOptionEnum.MAKE_APPOINTMENT;
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
