import moment, {Moment} from 'moment';
import {Meetings} from '@prisma/client';

//helpers
import {
  AppointmentIsValidHelper,
  FetchStartAndEndLunchTimeHelper,
  TransformAppointmentInDateHelper,
  ValidateIfIsDezemberHelper,
  PadStartDateHelper,
  FetchMaxAndMinAppointmentFromDay,
} from '@/helpers';

//services
import {FindConversationsService, FindMeetingsOfDayService} from '@/services';

import {InvalidDataIsProvidedError, InvalidDateError} from '@/errors';
import {IAppointmentsResult, IFlowResult} from '@/interfaces/flow';

import {FlowContext} from '../../flow.context';
import {StepResponseByOptionMenuFlow} from './step-03-response-by-option-menu.service';

export const isSameDate = (date1, date2) => date1.isSame(date2);

export const isAfter = (date) => moment(date).isAfter();

export const getDate = (date) => moment(date);
export const getDay = (date) => date.date();
export const getMonth = (date) => date.getMonth() + 1;

export const getHours = (date) => date.hours();
export const getMins = (date) => date.minutes();

export const getClone = (date) => date.clone();

export const setDay = (date, day) => date.date(day);
export const setMonth = (date, month) => date.month(month);
export const addDate = (date, input, type) => date.add(input, type);

export const setHours = (date, hour) => date.hours(hour);
export const setMinutes = (date, min) => date.minutes(min);
export const setSeconds = (date, sec) => date.seconds(sec);

export const isSaturday = (date) => date.isoWeekday() === 6;

export const INVALID_DATE = ():
  | InvalidDateError.INVALID_DATE_DEZEMBER
  | InvalidDateError.INVALID_DATE => {
  return ValidateIfIsDezemberHelper() === true
    ? InvalidDateError.INVALID_DATE_DEZEMBER
    : InvalidDateError.INVALID_DATE;
};

export const INVALID_SUNDAY = () => {
  return ValidateIfIsDezemberHelper() === true
    ? InvalidDateError.SUNDAY_DATE_DEZEMBER
    : InvalidDateError.SUNDAY_DATE;
};

export const INVALID_MONDAY = () => {
  return ValidateIfIsDezemberHelper() === true
    ? InvalidDateError.INVALID_MONDAY_DATE_DEZEMBER
    : InvalidDateError.INVALID_MONDAY_DATE;
};

interface IOptionsAppointment {
  options: string[];
  response: string;
}

/**
 * Etapa responsável por buscar horários disponiveis no dia escolhido pelo usuário
 */
export class StepFindAvaliableDateFlow {
  public readonly findConversationService: FindConversationsService;
  public readonly findMeetingsOfDayService: FindMeetingsOfDayService;
  public readonly stepResponseByOptionMenuFlow: StepResponseByOptionMenuFlow;
  public readonly stepCompleted: number = 4;
  public readonly incompleteStep: number = 3;

  public startLunchTimeOff: string | boolean = FlowContext.getStartLunchTime();
  public endLunchTimeOff: string | boolean = FlowContext.getEndLunchTime();
  public readonly appointmentTimeInMinutes =
    FlowContext.APPOINTMENT_TIME_IN_MINUTES;
  public disableAppointments: Meetings[] = [];

  constructor(
    findConversationService: FindConversationsService,
    findMeetingsOfDayService: FindMeetingsOfDayService,
    stepResponseByOptionMenuFlow: StepResponseByOptionMenuFlow,
  ) {
    this.findConversationService = findConversationService;
    this.findMeetingsOfDayService = findMeetingsOfDayService;
    this.stepResponseByOptionMenuFlow = stepResponseByOptionMenuFlow;
  }
  /**
   * Percorre os apontamentos agendados e verifica se está preenchido com a data a ser processada
   * @param startAppointment data de inicio do agendamento
   * @param endAppointment data fim
   * @returns Caso a data esteja preenchida retorna o agendamento
   */
  public appointmentAlreadyUsed(
    startAppointment: Moment,
    endAppointment: Moment,
  ): Meetings {
    return this.disableAppointments.find((item) => {
      return (
        moment(startAppointment).seconds(1).isAfter(item.startDate) &&
        moment(endAppointment).subtract(1, 'second').isBefore(item.endDate)
      );
    });
  }

  public dateIsLunchTime({date, lunchStart, lunchEnd}) {
    return moment(date).isAfter(lunchStart) && moment(date).isBefore(lunchEnd);
  }
  /**
   * Verifica se o agendamento está disponivel
   * @param startAppointment data de inicio do agendamento
   * @param endAppointment data fim
   * @returns Retorna true caso esteja disponível, false caso não
   */
  public verifyIfAppointmentIsAvaliable(
    startAppointment: Moment,
    endAppointment: Moment,
  ) {
    if (this.disableAppointments.length === 0) {
      return true;
    }

    const meetExists = this.appointmentAlreadyUsed(
      startAppointment,
      endAppointment,
    );

    if (meetExists) {
      return false;
    }

    return true;
  }
  /**
   * Recebe a data do apontamento e retorna bool false ou true se a data está em horário de almoço
   * @param date Data Moment
   * @returns True caso esteja em horário de almoço, False caso não esteja
   */
  validateIfAppointmentIsLunchTime(date: Moment): boolean {
    if (!this.startLunchTimeOff && !this.endLunchTimeOff) {
      return false;
    }
    const {start: lunchStart, end: lunchEnd} = FetchStartAndEndLunchTimeHelper(
      String(this.startLunchTimeOff),
      String(this.endLunchTimeOff),
    );

    const day = getDay(date);
    const month = getMonth(date);

    setDay(lunchStart, day);
    setMonth(lunchStart, month);

    setDay(lunchEnd, day);
    setMonth(lunchEnd, month);

    if (this.dateIsLunchTime({date, lunchStart, lunchEnd})) {
      return true;
    }

    return false;
  }
  /**
   * Retorna a lista de agendamentos disponiveis do dia passado por parâmetro
   * @param dayMonth dia/mês. Formato 10/06
   * @returns Retorna uma lista de agendamentos disponíveis
   */
  public async getAppointmentsOfDate(
    dayMonth: string,
  ): Promise<IAppointmentsResult[]> {
    const avaliabledMeetings: IAppointmentsResult[] = [];

    const dateAppointment = TransformAppointmentInDateHelper(dayMonth);

    const {startDate, endDate} =
      FetchMaxAndMinAppointmentFromDay(dateAppointment);

    const startDateMoment = getDate(startDate);

    let currentAppointment = getClone(startDate);
    let count: number = 0;

    //10/06 - pega todos os agendamentos do dia 10/06
    this.disableAppointments = await this.findMeetingsOfDayService.execute(
      startDateMoment,
    );

    do {
      const currentStartAppointment = getClone(currentAppointment);

      const hourStartTime = PadStartDateHelper(
        getHours(currentStartAppointment),
        2,
      );

      const minStartTime = PadStartDateHelper(
        getMins(currentStartAppointment),
        2,
      );

      const currentEndAppointment = getClone(
        addDate(currentAppointment, this.appointmentTimeInMinutes, 'minutes'),
      );

      const isAfterNow = isAfter(currentStartAppointment);

      if (!isAfterNow) {
        continue;
      }

      const isLunchTime = this.validateIfAppointmentIsLunchTime(
        currentStartAppointment,
      );

      if (isLunchTime) {
        continue;
      }

      if (
        !this.verifyIfAppointmentIsAvaliable(
          currentStartAppointment,
          currentEndAppointment,
        )
      ) {
        continue;
      }

      const avaliableAppointment = `${hourStartTime}:${minStartTime}`;

      count++;

      avaliabledMeetings.push({
        option: count,
        description: avaliableAppointment,
      });
    } while (!isSameDate(currentAppointment, endDate));

    return avaliabledMeetings;
  }
  /**
   * Retorna string com a lista de horários disponiveis
   * @param listOptions Lista de horários
   * @param dayMonth dia/mês. Ex: 10/06
   * @returns Retorna a lista de horários e a mensagem da lista de agendamentos
   */
  public getMessageListOptions(
    listOptions: IAppointmentsResult[] = [],
    dayMonth: string,
  ): IOptionsAppointment {
    const avaliableOptions: any = {};

    listOptions.forEach(({option, description}) => {
      avaliableOptions[option] = description;
    });

    let response;
    if (listOptions.length > 0) {
      response = `Para o dia ${dayMonth} temos esses horários disponiveis, escolha uma das opções abaixo: \n\n`;
      response += listOptions.map(
        ({option, description}) => `${option}- ${description} \n`,
      );
      response = response.replaceAll(',', '');
    } else {
      response = `Para o dia ${dayMonth} não temos horários disponiveis. \n`;
    }

    response += `\n`;
    response += `Digite 0 para escolher outra data`;

    return {options: avaliableOptions, response};
  }
  /**
   * Busca o dia/mês digitado pelo usuário
   * @param accountId usuario
   * @returns Retorna o dia/mês. Ex 10/06
   */
  async getDateAppointment(accountId: string): Promise<string> {
    const result = await this.findConversationService.findOne({
      where: {
        accountId: accountId,
        toPhone: Number(FlowContext.BOT_NUMBER),
        step: 3,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!result) {
      throw new Error('Flow Error get day month');
    }
    const dayMonth = result.body;

    const isValid = AppointmentIsValidHelper(dayMonth);

    if (isValid === true) {
      return dayMonth;
    }

    throw new InvalidDataIsProvidedError(isValid);
  }

  async execute(accountId: string): Promise<IFlowResult> {
    try {
      const dayMonthAppointment = await this.getDateAppointment(accountId);

      const listOptions = await this.getAppointmentsOfDate(dayMonthAppointment);

      const {response, options} = this.getMessageListOptions(
        listOptions,
        dayMonthAppointment,
      );

      return {
        response,
        options,
        step: this.stepCompleted,
      };
    } catch (error) {
      console.error(error);

      if (
        [INVALID_DATE(), INVALID_SUNDAY(), INVALID_MONDAY()].includes(
          error.message,
        )
      ) {
        return {
          response: error.message,
          step: this.incompleteStep,
        };
      }

      const {response, step} = await this.stepResponseByOptionMenuFlow.execute(
        accountId,
      );
      return {response, step};
    }
  }
}
