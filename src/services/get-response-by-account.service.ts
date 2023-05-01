import {FindConversationsService} from './find-conversation.service';
import {FlowContext} from '../flow';
import {QuestionError} from '../helpers';
import 'dotenv/config';
import {AppointmentIsValidHelper} from '../helpers/validate-appoitment';
const BOT_NUMBER = process.env.BOT_NUMBER;

type IResponseByAccount = {
  [key: number]: string;
};
export class GetResponseByAccountService {
  private readonly findConversationService: FindConversationsService;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }

  async getStepFlow(accountId: string): Promise<number> {
    const conversation = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        fromPhone: Number(BOT_NUMBER),
      },
    });
    const step = conversation?.step || 0;
    return step + 1;
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

  async getDayMonth(accountId: string): Promise<string> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        //adicionar from phone user
      },
    });
    if (!result) {
      throw new Error('Flow Error get day month');
    }
    const dayMonth = result.body;

    if (!AppointmentIsValidHelper(dayMonth)) {
      return QuestionError.TRY_AGAIN;
    }
    return dayMonth;
  }

  async getUserName(accountId: string): Promise<string> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
      },
    });
    if (!result) {
      throw new Error('Conversation not found to find a user name');
    }
    const name = result.body;
    return name;
  }

  async execute(accountId: string): Promise<{step: number; response: string}> {
    type TypeStep = keyof IResponseByAccount;
    const step: TypeStep = await this.getStepFlow(accountId);

    if (step === 1) {
      return {response: FlowContext.WELCOME, step: 1};
    } else if (step === 2) {
      const user = await this.getUserName(accountId);
      return {response: FlowContext.showMenu(user), step: 2};
    } else if (step === 3) {
      const menuSelected = await this.getOptionMenu(accountId);
      if (menuSelected === QuestionError.TRY_AGAIN) {
        return {response: QuestionError.TRY_AGAIN, step: 2};
      }
      const menuText = FlowContext.showTextByMenu(menuSelected);
      let internalStep: number = 0;
      if (menuText === FlowContext.MAKE_APPOINTMENT) {
        internalStep = 3;
      } else if (menuText === FlowContext.RENAME_USER) {
        internalStep = 1;
      }
      return {
        response: menuText,
        step: internalStep,
      };
    } else if (step === 4) {
      const dayMonth = await this.getDayMonth(accountId);

      if (dayMonth === QuestionError.TRY_AGAIN) {
        return {response: QuestionError.TRY_AGAIN, step: 3};
      }
      return {
        response: FlowContext.findAvaliableTime(dayMonth),
        step: 4,
      };
    } else if (step === 5) {
      return {response: 'method not implemented', step: 999};
    } else {
      return {response: 'method not implemented', step: 999};
    }
  }
}
