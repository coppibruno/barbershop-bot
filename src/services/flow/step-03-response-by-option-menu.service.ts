import {FlowContext} from '../../flow.context';
import {QuestionError} from '../../helpers';
import {IFlowResult} from '../../interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';

export class StepResponseByOptionMenuFlow {
  private readonly findConversationService: FindConversationsService;
  private readonly stepCompleted: number = 3;
  private readonly incompleteStep: number = 2;
  private readonly stepRenameUser: number = 1;

  private readonly messageToMakeAppointment = FlowContext.MAKE_APPOINTMENT;
  private readonly messageToRenameUser = FlowContext.RENAME_USER;
  private readonly messageToGoodBye = FlowContext.GOODBYE;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }

  showTextByMenu(menuSelected: number): string {
    type IResponseByAccount = {
      [key: number]: string;
    };
    if (menuSelected === 0) {
      return this.messageToGoodBye;
    }

    const menu = menuSelected - 1;

    const options: IResponseByAccount = {
      0: this.messageToMakeAppointment,
      1: this.messageToRenameUser,
    };
    return options[menu];
  }

  async getOptionMenu(
    accountId: string,
  ): Promise<number | QuestionError.TRY_AGAIN> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
      },
    });
    if (!result) {
      throw new Error('Flow Error get day month');
    }

    const menu = Number(result.body);

    const options = FlowContext.getIndexMenu();
    if (options.includes(menu)) {
      return Number(menu);
    }
    return QuestionError.TRY_AGAIN;
  }

  async execute(accountId: string): Promise<IFlowResult> {
    const menuSelected = await this.getOptionMenu(accountId);
    if (menuSelected === QuestionError.TRY_AGAIN) {
      return {response: QuestionError.TRY_AGAIN, step: this.incompleteStep};
    }
    const menuText = this.showTextByMenu(menuSelected);
    let step: number = 0;
    if (menuText === this.messageToMakeAppointment) {
      step = this.stepCompleted;
    } else if (menuText === this.messageToRenameUser) {
      step = this.stepRenameUser;
    }
    return {
      response: menuText,
      step,
    };
  }
}
