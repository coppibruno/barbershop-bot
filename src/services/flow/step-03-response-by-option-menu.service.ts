import {FlowContext} from '../../flow.context';
import {IFlowResult} from '../../interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';
import {InvalidMenuOptionError} from '../../errors/invalid-menu-option.enum';
import {ValidateIfIsDezemberHelper} from '../../helpers/validate-if-is-dezember.helper';
import {DefaultError} from '../../errors';

const isDezember = () => ValidateIfIsDezemberHelper();

enum OptionsMenuEnum {
  CLOSE_SERVICE = 0,
  MAKE_APPOINTMENT = 1,
  RENAME_USER = 2,
}

enum ResponseOptionEnum {
  MAKE_APPOINTMENT = 'MAKE_APPOINTMENT',
  RENAME_USER = 'RENAME_USER',
  CLOSE_SERVICE = 'CLOSE_SERVICE',
  INVALID_OPTION = 'INVALID_OPTION',
}

/**
 * Etapa responsável por processar a opção digitada no menu e responder conforme opção escolhida
 * 1- Agendar horário
 * 2- Renomear nome de identificação
 * 0- Encerrar atendimento
 */
export class StepResponseByOptionMenuFlow {
  private readonly findConversationService: FindConversationsService;
  public readonly stepCompleted: number = 3;
  public readonly incompleteStep: number = 2;
  public readonly stepRenameUser: number = 1;

  public readonly messageToMakeAppointment = isDezember()
    ? FlowContext.MAKE_APPOINTMENT_DEZEMBER
    : FlowContext.MAKE_APPOINTMENT;
  public readonly messageToRenameUser = FlowContext.RENAME_USER;
  public readonly messageToGoodBye = FlowContext.GOODBYE;

  public readonly menu = FlowContext.MENU_2;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }

  replyByMenu(option: number): ResponseOptionEnum {
    const options = this.menu;

    const optionSelected = options.find((menu) => menu.option === option);

    if (!optionSelected) {
      return ResponseOptionEnum.INVALID_OPTION;
    }

    if (optionSelected.option === OptionsMenuEnum.CLOSE_SERVICE) {
      return ResponseOptionEnum.CLOSE_SERVICE;
    } else if (optionSelected.option === OptionsMenuEnum.MAKE_APPOINTMENT) {
      return ResponseOptionEnum.MAKE_APPOINTMENT;
    } else if (optionSelected.option === OptionsMenuEnum.RENAME_USER) {
      return ResponseOptionEnum.RENAME_USER;
    }

    throw new Error('Option not implemented');
  }

  async getOptionMenu(accountId: string): Promise<number> {
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

    return Number(result.body);
  }

  async execute(accountId: string): Promise<IFlowResult> {
    const defaultResult = {
      response: DefaultError.TRY_AGAIN,
      step: this.incompleteStep,
    };

    try {
      const selected = await this.getOptionMenu(accountId);

      const result = this.replyByMenu(selected);

      let step: number = 0;
      let response;
      if (result === ResponseOptionEnum.MAKE_APPOINTMENT) {
        response = this.messageToMakeAppointment;
        step = this.stepCompleted;
      } else if (result === ResponseOptionEnum.RENAME_USER) {
        response = this.messageToRenameUser;
        step = this.stepRenameUser;
      } else if (result === ResponseOptionEnum.CLOSE_SERVICE) {
        response = this.messageToGoodBye;
        step = this.incompleteStep;
      } else if (result === ResponseOptionEnum.INVALID_OPTION) {
        response = InvalidMenuOptionError.INVALID_MENU_OPTION;
        step = this.incompleteStep;
      } else {
        response = defaultResult.response;
        step = defaultResult.step;
      }

      return {
        response,
        step,
      };
    } catch (error) {
      console.error(error);
      return {
        response: defaultResult.response,
        step: defaultResult.step,
      };
    }
  }
}
