import {FlowContext, typeMenuUser} from '../../flow.context';
import {IFlowResult} from '@/interfaces/flow';
import {FindConversationsService} from '@/services/find-conversation.service';
import {InvalidMenuOptionError, DefaultError, NotFoundError} from '@/errors';
import {ValidateIfIsDezemberHelper} from '@/helpers/validate-if-is-dezember.helper';
import {State} from '@prisma/client';

const isDezember = () => ValidateIfIsDezemberHelper();

type Types = {
  type: typeMenuUser;
  response: string;
  step: number;
  state: State;
}[];

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

  public readonly invalidMenu = 'Invalid menu option';

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
      throw new NotFoundError(this.invalidMenu);
    }

    return optionSelected.type;
  }

  async getOptionMenu(phone: number): Promise<number> {
    const result = await this.findConversationService.findOne({
      where: {
        fromPhone: phone,
        toPhone: Number(FlowContext.BOT_NUMBER),
        step: 3,
        state: 'IN_PROGRESS',
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

  async execute(phone: number): Promise<IFlowResult> {
    const defaultResult = {
      response: InvalidMenuOptionError.INVALID_MENU_OPTION,
      step: this.incompleteStep,
    };

    try {
      const selected = await this.getOptionMenu(phone);

      const menuSelectType = this.replyByMenu(selected);

      const types: Types = [
        {
          type: typeMenuUser.APPOINTMENT,
          response: this.messageToMakeAppointment,
          step: this.stepCompleted,
          state: 'IN_PROGRESS',
        },
        {
          type: typeMenuUser.CHANGE_NAME,
          response: this.messageToRenameUser,
          step: this.stepRenameUser,
          state: 'IN_PROGRESS',
        },
        {
          type: typeMenuUser.CLOSE_SERVICE,
          response: this.messageToGoodBye,
          step: this.incompleteStep,
          state: 'FINISHED',
        },
      ];

      const {response, step, state} = types.find(
        ({type}) => type === menuSelectType,
      );

      return {
        response,
        step,
        state,
      };
    } catch (error) {
      return {
        response: defaultResult.response,
        step: defaultResult.step,
      };
    }
  }
}
