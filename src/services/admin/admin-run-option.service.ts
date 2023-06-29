import {FlowContext, typeMenuAdmin} from '../../flow.context';
import {IFlowResult} from '@/interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';
import {AdminResponseByOptionMenu} from './admin-response-by-option-menu.service';
import {
  AppointmentIsValidHelper,
  ConvertIntervalTimeInObject,
  FetchMaxAndMinAppointmentFromDay,
  PadStartDateHelper,
  RemoveBlankSpacesHelper,
  TransformAppointmentInDateHelper,
} from '@/helpers';
import {FindMeetingsOfDayService} from '../find-meetings-of-day.service';
import {Meetings} from '@prisma/client';
import moment, {Moment} from 'moment';
import {InvalidDataIsProvidedError} from '@/errors';

export type IExtractDayMonthAndTime = {
  dayMonth: string;
  intervalTime?: string;
};
export interface IStartAndEndDate {
  startDate: Moment;
  endDate: Moment;
}

export const getDay = (date: Moment) => date.date();
export const getMonth = (date: Moment) => date.month() + 1;
export const getHours = (date: Moment) => date.hours();
export const getMins = (date: Moment) => date.minutes();

export const getHoursMin = (date: Moment): string => {
  const hours = PadStartDateHelper(date.hours(), 2);

  const mins = PadStartDateHelper(date.minutes(), 2);

  return `${hours}:${mins}`;
};

/**
 * Etapa responsável executar a funcionalidade solicitada pelo admin (ETAPA 02)
 * '1- Visualizar agendamentos de algum dia',
 * '2- Desmarcar horários'
 */
export class AdminRunOption {
  public readonly adminMenu = FlowContext.MENU_ADMIN;
  public readonly findConversationService: FindConversationsService;
  public readonly findMeetingsOfDayService: FindMeetingsOfDayService;

  constructor(
    findConversationService: FindConversationsService,
    findMeetingsOfDayService: FindMeetingsOfDayService,
  ) {
    this.findConversationService = findConversationService;
    this.findMeetingsOfDayService = findMeetingsOfDayService;
  }

  public getMenuConfirmationCancel(messageCancelAppointment: string) {
    const menuConfirmation = FlowContext.getMenuConfirmationCancelAppointment(
      messageCancelAppointment,
    );

    let response = 'Selecione uma das opções numéricas abaixo: \n';

    const menu = menuConfirmation.map(
      (item) => `${item.option} - ${item.label} \n`,
    );

    response += menu;
    return response.replaceAll(',', '');
  }

  public timeResponseDisable({startDate, endDate}: IStartAndEndDate): string {
    const [day, month] = [
      PadStartDateHelper(getDay(startDate), 2),
      PadStartDateHelper(getMonth(startDate), 2),
    ];
    const [startHour, startMin] = [
      PadStartDateHelper(getHours(startDate), 2),
      PadStartDateHelper(getMins(startDate), 2),
    ];
    const [endHour, endMins] = [
      PadStartDateHelper(getHours(endDate), 2),
      PadStartDateHelper(getMins(endDate), 2),
    ];

    let response = `Você confirma desabilitar o dia ${day}/${month},`;
    response += ` das ${startHour}:${startMin} até ${endHour}:${endMins}`;

    return response;
  }

  public extractDayMonthAndTime(data: string): IExtractDayMonthAndTime {
    const dayMonth = data.substring(0, 5);

    const result: IExtractDayMonthAndTime = {
      dayMonth,
    };

    if (data.length > 5) {
      let intervalTime = data.substring(5, data.length);
      intervalTime = RemoveBlankSpacesHelper(intervalTime);

      result.intervalTime = intervalTime;
    }

    return result;
  }

  public async getAppointmentsToDisable(
    accountId: string,
  ): Promise<IStartAndEndDate> {
    const userAnswer = await this.userAnswer(accountId);

    let {dayMonth, intervalTime} = this.extractDayMonthAndTime(userAnswer);
    const isValidate = AppointmentIsValidHelper(dayMonth);

    if (isValidate !== true) {
      throw new InvalidDataIsProvidedError(isValidate);
    }

    let startDate: Date;
    let endDate: Date;
    if (intervalTime) {
      ({startDate, endDate} = ConvertIntervalTimeInObject(
        dayMonth,
        intervalTime,
      ));
    } else {
      const date = TransformAppointmentInDateHelper(dayMonth);
      ({startDate, endDate} = FetchMaxAndMinAppointmentFromDay(date));
    }

    return {startDate: moment(startDate), endDate: moment(endDate)};
  }

  public async getMenuRequest(accountId: string): Promise<typeMenuAdmin> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        toPhone: Number(FlowContext.BOT_NUMBER),
        step: 1,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!result) {
      throw new Error('Flow Error get menu');
    }

    const menu = Number(result.body);

    const menuSelected = this.adminMenu.find((i) => i.option === menu);

    return menuSelected.type;
  }

  public async userAnswer(accountId: string): Promise<string> {
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
      throw new Error('Flow Error get menu');
    }

    return result.body;
  }

  public async listAppointmentsFromDay(accountId): Promise<Meetings[]> {
    const dayMonth = await this.userAnswer(accountId);

    const isValidate = AppointmentIsValidHelper(dayMonth);

    if (isValidate !== true) {
      throw new InvalidDataIsProvidedError(isValidate);
    }

    const date = TransformAppointmentInDateHelper(dayMonth);

    return this.findMeetingsOfDayService.execute(date);
  }

  public async responseListAppointmentsFromDay(
    accountId: string,
    appointments: Meetings[],
  ): Promise<string> {
    const dayMonth = await this.userAnswer(accountId);

    if (appointments.length === 0) {
      return `Para o dia ${dayMonth} não há horários marcados`;
    }

    let message = `Para o dia ${dayMonth}, temos os seguintes horários: \n`;

    message += appointments.map(
      (i) => `${getHoursMin(moment(i.startDate))} - ${i.name} \n`,
    );

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

        //Todo: encerrar chat aqui

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
      const adminResponseByOptionMenu = new AdminResponseByOptionMenu(
        this.findConversationService,
      );
      const {response, step} = await adminResponseByOptionMenu.execute(
        accountId,
      );

      return {response, step};
    }
  }
}
