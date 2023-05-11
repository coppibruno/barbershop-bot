import {FlowContext} from '../../flow.context';
import {IFlowResult} from '../../interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';
import {InvalidMenuOptionError} from '../../errors/invalid-menu-option.enum';
import {ValidateIfIsDezember} from '../../helpers/validate-if-is-dezember';

export class StepResponseByOptionMenuFlow {
  private readonly findConversationService: FindConversationsService;
  private readonly stepCompleted: number = 3;
  private readonly incompleteStep: number = 2;
  private readonly stepRenameUser: number = 1;

  private readonly messageToMakeAppointment = FlowContext.MAKE_APPOINTMENT;
  private readonly messageToMakeAppointmentDezember =
    FlowContext.MAKE_APPOINTMENT_DEZEMBER;
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

    const isDezember = ValidateIfIsDezember();
    let messageToMakeAppointment = this.messageToMakeAppointment;
    if (isDezember) {
      messageToMakeAppointment = this.messageToMakeAppointmentDezember;
    }

    const options: IResponseByAccount = {
      0: messageToMakeAppointment,
      1: this.messageToRenameUser,
    };
    return options[menu];
  }

  async getOptionMenu(
    accountId: string,
  ): Promise<number | InvalidMenuOptionError.INVALID_MENU_OPTION> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        toPhone: Number(FlowContext.BOT_NUMBER),
        step: 2,
      },
      orderBy: {
        createdAt: 'desc',
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
    return InvalidMenuOptionError.INVALID_MENU_OPTION;
  }

  async execute(accountId: string): Promise<IFlowResult> {
    const menuSelected = await this.getOptionMenu(accountId);
    if (menuSelected === InvalidMenuOptionError.INVALID_MENU_OPTION) {
      return {
        response: InvalidMenuOptionError.INVALID_MENU_OPTION,
        step: this.incompleteStep,
      };
    }
    const menuText = this.showTextByMenu(menuSelected);
    let step: number = 0; //criar ENUM para identificar qual será o proximo passo
    if (
      menuText === this.messageToMakeAppointment ||
      menuText === this.messageToMakeAppointmentDezember
    ) {
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
