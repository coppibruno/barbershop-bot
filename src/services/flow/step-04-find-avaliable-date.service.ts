import {AppointmentIsValidHelper} from '../../helpers';
import {
  DefaultError,
  InvalidAppointmentError,
  InvalidDateError,
} from '../../errors';
import {IFlowResult} from '../../interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';

export class StepFindAvaliableDateFlow {
  private readonly findConversationService: FindConversationsService;
  private readonly stepCompleted: number = 4;
  private readonly incompleteStep: number = 3;

  constructor(findConversationService: FindConversationsService) {
    this.findConversationService = findConversationService;
  }

  findAvaliableTime(dayMonth: string): string {
    return `Para o dia ${dayMonth} temos esses horários disponiveis: \n
        09:00 \n
        10:00 \n
        11:00 \n
        14:00 \n
        15:00 \n
        17:00 \n
        18:00 \n
        19:00 \n
    `;
  }

  async getDateAppointment(accountId: string): Promise<string> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
      },
    });
    if (!result) {
      throw new Error('Flow Error get day month');
    }
    const dayMonth = result.body;

    if (!AppointmentIsValidHelper(dayMonth)) {
      return InvalidDateError.INVALID_DATE;
    }
    return dayMonth;
  }

  async execute(accountId: string): Promise<IFlowResult> {
    const appointment = await this.getDateAppointment(accountId);

    if (appointment === InvalidDateError.INVALID_DATE) {
      return {
        response: InvalidDateError.INVALID_DATE,
        step: this.incompleteStep,
      };
    }
    return {
      response: this.findAvaliableTime(appointment),
      step: this.stepCompleted,
    };
  }
}
