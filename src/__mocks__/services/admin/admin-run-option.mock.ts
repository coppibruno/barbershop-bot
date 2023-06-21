import {fakeMeeting} from '@/__mocks__/entities';
import {typeMenuAdmin} from '@/flow.context';
import {IFlowResult} from '@/interfaces/flow';
import {AdminRunOption} from '@/services/admin';
import {
  IExtractDayMonthAndTime,
  IStartAndEndDate,
  getHoursMin,
} from '@/services/admin/admin-run-option.service';
import {faker} from '@faker-js/faker';
import {Meetings} from '@prisma/client';
import {FindConversationsServiceStub} from '../find-conversation-service.mock';
import {FindMeetingsOfDayServiceStub} from '../find-meetings-of-day-service.mock';
import {AdminResponseByOptionMenuStub} from './admin-response-by-option-menu.mock';

const mockedTime = faker.date.future();
const day = mockedTime.getDay();
const month = mockedTime.getMonth() + 1;
const startHour = mockedTime.getHours();
const startMin = mockedTime.getMinutes();
const endHour = mockedTime.getHours();
const endMins = mockedTime.getMinutes();
const dayMonth = `${day}/${month}`;

/**
 * Etapa responsável executar a funcionalidade solicitada pelo admin
 * '1- Visualizar agendamentos de algum dia',
 * '2- Desmarcar horários'
 */
export class AdminRunOptionStub extends AdminRunOption {
  constructor(
    private readonly findConversationServiceStub: FindConversationsServiceStub,
    private readonly findMeetingsOfDayServiceStub: FindMeetingsOfDayServiceStub,
  ) {
    super(findConversationServiceStub, findMeetingsOfDayServiceStub);
  }

  public getMenuConfirmationCancel(messageCancelAppointment: string) {
    return '';
  }

  public timeResponseDisable({startDate, endDate}: IStartAndEndDate): string {
    let response = `Você confirma desabilitar o dia ${day}/${month},`;
    response += ` das ${startHour}:${startMin} até ${endHour}:${endMins}`;

    return response;
  }

  public extractDayMonthAndTime(data: string): IExtractDayMonthAndTime {
    return {
      dayMonth,
      intervalTime: '09:00 - 12:00',
    };
  }

  public async getAppointmentsToDisable(
    accountId: string,
  ): Promise<IStartAndEndDate> {
    return Promise.resolve({
      startDate: mockedTime,
      endDate: mockedTime,
    });
  }

  public async getMenuRequest(accountId: string): Promise<typeMenuAdmin> {
    return Promise.resolve(typeMenuAdmin.MARK_OFF_MEETING);
  }

  public async userAnswer(accountId: string): Promise<string> {
    return dayMonth;
  }

  public async listAppointmentsFromDay(accountId: string): Promise<any> {
    return Promise.resolve([fakeMeeting(), fakeMeeting]);
  }

  public async responseListAppointmentsFromDay(
    accountId: string,
    appointments: Meetings[],
  ): Promise<string> {
    let message = `Para o dia ${dayMonth}, temos os seguintes horários: \n`;

    message += [
      {startDate: mockedTime, endDate: mockedTime},
      {startDate: mockedTime, endDate: mockedTime},
      {startDate: mockedTime, endDate: mockedTime},
    ].map((i) => getHoursMin(i.startDate) + '\n');

    return message.replaceAll(',', '');
  }

  async execute(accountId: string): Promise<IFlowResult> {
    try {
      const typeMenu = await this.getMenuRequest(accountId);

      if (typeMenu === typeMenuAdmin.SHOW_MENU_MEETING) {
        const appointments = await this.listAppointmentsFromDay(accountId);
        const response = await this.responseListAppointmentsFromDay(
          accountId,
          appointments,
        );

        return {response, step: 3};
      }

      if (typeMenu === typeMenuAdmin.MARK_OFF_MEETING) {
        const {startDate, endDate} = await this.getAppointmentsToDisable(
          accountId,
        );

        const messageCancelAppointment = this.timeResponseDisable({
          startDate,
          endDate,
        });

        const response = this.getMenuConfirmationCancel(
          messageCancelAppointment,
        );

        return {response, step: 3};
      }
    } catch (error) {
      console.error(error);
      //call previous step
      const adminResponseByOptionMenuStub = new AdminResponseByOptionMenuStub(
        this.findConversationServiceStub,
      );
      const {response, step} = await adminResponseByOptionMenuStub.execute(
        accountId,
      );

      return {response, step};
    }
  }
}
