import {FlowContext, typeMenuUser} from '../../flow.context';
import {IFlowResult} from '@/interfaces/flow';
import {FindConversationsService} from '@/services/find-conversation.service';
import {InvalidMenuOptionError, DefaultError} from '@/errors';
import {ValidateIfIsDezemberHelper} from '@/helpers/validate-if-is-dezember.helper';

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

  replyByMenu(option: number): typeMenuUser {
    const options = this.menu;

    const optionSelected = options.find((menu) => menu.option === option);

    if (!optionSelected) {
      throw new Error('invalid option selected');
    }

    return optionSelected.type;
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
      response: InvalidMenuOptionError.INVALID_MENU_OPTION,
      step: this.incompleteStep,
    };

    try {
      const selected = await this.getOptionMenu(accountId);

      const menuSelectType = this.replyByMenu(selected);

      const types = [
        {
          type: typeMenuUser.APPOINTMENT,
          response: this.messageToMakeAppointment,
          step: this.stepCompleted,
        },
        {
          type: typeMenuUser.CHANGE_NAME,
          response: this.messageToRenameUser,
          step: this.stepRenameUser,
        },
        {
          type: typeMenuUser.CLOSE_SERVICE,
          response: this.messageToGoodBye,
          step: this.incompleteStep,
        },
      ];

      const {response, step} = types.find(({type}) => type === menuSelectType);

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
