import {FlowContext, typeMenuAdmin} from '../../flow.context';
import {IFlowResult} from '@/interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';
import {AdminResponseByOptionMenu} from './admin-response-by-option-menu.service';
import {
  AppointmentIsValidHelper,
  FetchMaxAndMinAppointmentFromDay,
  FetchStartAndEndAppointmentTimeHelper,
  PadStartDateHelper,
  RemoveBlankSpacesHelper,
  TransformAppointmentInDateHelper,
} from '@/helpers';
import {FindMeetingsOfDayService} from '../find-meetings-of-day.service';
import {Meetings} from '@prisma/client';
import moment from 'moment';
import {DisableMeetingsOfIntervalService} from '../disable-meetings-of-interval.service';
import {InvalidDataIsProvidedError} from '@/errors';
import {WelcomeAdminAndShowMenu} from './welcome-admin-and-show-menu.service';
import {AdminRunOption} from './admin-run-option.service';

type IExtractDayMonthAndTime = {
  dayMonth: string;
  intervalTime?: string;
};
interface IStartAndEndDate {
  startDate: Date;
  endDate: Date;
}

export const getDay = (date) => date.date();
export const getMonth = (date) => date.month() + 1;
export const getHours = (date) => date.hours();
export const getMins = (date) => date.minutes();

export const getHoursMin = (date): string => {
  const hours = PadStartDateHelper(moment(date).hours(), 2);

  const mins = PadStartDateHelper(moment(date).minutes(), 2);

  return `${hours}:${mins}`;
};

/**
 * Etapa responsável por ler menu e inativar dia/horário ou voltar ao menu principal do admin
 * '1- Sim, desejo cancelar o horario 10/06 10:00 20:00',
 * '0- Retornar ao menu anterior'
 */
export class AdminRunOptionPersists {
  private readonly findConversationService: FindConversationsService;
  private readonly findMeetingsOfDayService: FindMeetingsOfDayService;
  private readonly disableMeetingsOfIntervalService: DisableMeetingsOfIntervalService;

  constructor(
    findConversationService: FindConversationsService,
    findMeetingsOfDayService: FindMeetingsOfDayService,
    disableMeetingsOfIntervalService: DisableMeetingsOfIntervalService,
  ) {
    this.findConversationService = findConversationService;
    this.findMeetingsOfDayService = findMeetingsOfDayService;
    this.disableMeetingsOfIntervalService = disableMeetingsOfIntervalService;
  }

  private async getMenuRequest(accountId: string): Promise<typeMenuAdmin> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        toPhone: Number(FlowContext.BOT_NUMBER),
        step: 8,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!result) {
      throw new Error('Flow Error get menu');
    }

    const menu = Number(result.body);

    const menuSelected =
      FlowContext.getMenuConfirmationCancelAppointment().find(
        (i) => i.option === menu,
      );

    return menuSelected.type;
  }

  async execute(accountId: string): Promise<IFlowResult> {
    try {
      const typeMenu = await this.getMenuRequest(accountId);

      if (typeMenu === typeMenuAdmin.MARK_OFF_MEETING) {
        const adminRunOption = new AdminRunOption(
          this.findConversationService,
          this.findMeetingsOfDayService,
        );
        const {startDate, endDate} =
          await adminRunOption.getAppointmentsToDisable(accountId);

        await this.disableMeetingsOfIntervalService.execute({
          startDate,
          endDate,
        });

        return {response: FlowContext.SUCCESSFUL_OPERATION, step: 9};
      }

      if (typeMenu === typeMenuAdmin.SHOW_MENU_AGAIN) {
        const welcomeAdminAndShowMenu = new WelcomeAdminAndShowMenu();
        const {response, step} = welcomeAdminAndShowMenu.execute();

        return {response, step};
      }
    } catch (error) {
      console.error(error);
      //call previous step
      const welcomeAdminAndShowMenu = new WelcomeAdminAndShowMenu();
      const {response, step} = welcomeAdminAndShowMenu.execute();

      return {response, step};
    }
  }
}
