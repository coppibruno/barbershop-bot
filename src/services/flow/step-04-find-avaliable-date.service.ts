import {
  AppointmentIsValidHelper,
  FetchStartAndEndLunchTimeHelper,
  TransformAppointmentInDateHelper,
} from '../../helpers';
import {InvalidDateError} from '../../errors';
import {IAppointmentsResult, IFlowResult} from '../../interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';
import {FlowContext} from '../../flow.context';
import moment, {Moment} from 'moment';
import {FindMeetingsOfDayService} from '../find-meetings-of-day.service';
import {Meetings} from '@prisma/client';
import {PadStartDateHelper} from '../../helpers/pad-start.helper';
import {isDezember} from '../../helpers/validate-appoitment.helper';

export const isSameDate = (date1, date2) => date1.isSame(date2);

export const isAfter = (date) => moment(date).isAfter();

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
  return isDezember() === true
    ? InvalidDateError.INVALID_DATE_DEZEMBER
    : InvalidDateError.INVALID_DATE;
};

export const INVALID_SUNDAY = () => {
  return isDezember() === true
    ? InvalidDateError.SUNDAY_DATE_DEZEMBER
    : InvalidDateError.SUNDAY_DATE;
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
  public readonly stepCompleted: number = 4;
  public readonly incompleteStep: number = 3;

  public startAppointmentDay = FlowContext.START_APPOINTMENT_DAY;
  public endAppointmentDay = FlowContext.END_APPOINTMENT_DAY;
  public startSaturdayAppointmentDay =
    FlowContext.START_SATURDAY_APPOINTMENT_DAY;
  public endSaturdayAppointmentDay = FlowContext.END_SATURDAY_APPOINTMENT_DAY;
  public startLunchTimeOff: string | boolean = FlowContext.getStartLunchTime();
  public endLunchTimeOff: string | boolean = FlowContext.getEndLunchTime();
  public readonly appointmentTimeInMinutes =
    FlowContext.APPOINTMENT_TIME_IN_MINUTES;

  constructor(
    findConversationService: FindConversationsService,
    findMeetingsOfDayService: FindMeetingsOfDayService,
  ) {
    this.findConversationService = findConversationService;
    this.findMeetingsOfDayService = findMeetingsOfDayService;
  }

  appointmentAlreadyUsed(meetsOfDay, startAppointment, endAppointment) {
    return meetsOfDay.find((item) => {
      return (
        moment(startAppointment).seconds(1).isAfter(item.startDate) &&
        moment(endAppointment).subtract(1, 'second').isBefore(item.endDate)
      );
    });
  }

  isOnLunchBreak({appointment, lunchStart, lunchEnd}) {
    return (
      moment(appointment).isAfter(lunchStart) &&
      moment(appointment).isBefore(lunchEnd)
    );
  }

  getMaxAndMinAppointmentFromDay(date: Moment): {
    startDate: Moment;
    endDate: Moment;
  } {
    const startTime = this.startAppointmentDay.split(':');
    const endTime = this.endAppointmentDay.split(':');

    let startHour = Number(startTime[0]);
    let startMin = Number(startTime[1]);

    let endHour = Number(endTime[0]);
    let endMin = Number(endTime[1]);

    const saturday = isSaturday(date);

    if (saturday) {
      const startTime = this.startSaturdayAppointmentDay.split(':');
      const endTime = this.endSaturdayAppointmentDay.split(':');

      startHour = Number(startTime[0]);
      startMin = Number(startTime[1]);

      endHour = Number(endTime[0]);
      endMin = Number(endTime[1]);
    }

    const start = getClone(date);
    const end = getClone(date);

    setHours(start, startHour);
    setMinutes(start, startMin);
    setSeconds(start, 0);

    setHours(end, endHour);
    setMinutes(end, endMin);
    setSeconds(end, 0);

    return {startDate: start, endDate: end};
  }

  verifyIfAppointmentIsAvaliable(
    meetsOfDay: Meetings[],
    startAppointment: Moment,
    endAppointment: Moment,
  ) {
    if (meetsOfDay.length === 0) {
      return true;
    }

    const meetExists = this.appointmentAlreadyUsed(
      meetsOfDay,
      startAppointment,
      endAppointment,
    );

    if (meetExists) {
      return false;
    }

    return true;
  }

  validateIfAppointmentIsLunchTime(appointment: Moment): boolean {
    if (!this.startLunchTimeOff && !this.endLunchTimeOff) {
      return false;
    }
    const {start: lunchStart, end: lunchEnd} = FetchStartAndEndLunchTimeHelper(
      String(this.startLunchTimeOff),
      String(this.endLunchTimeOff),
    );

    const day = getDay(appointment);
    const month = getMonth(appointment);

    setDay(lunchStart, day);
    setMonth(lunchStart, month);

    setDay(lunchEnd, day);
    setMonth(lunchEnd, month);

    if (this.isOnLunchBreak({appointment, lunchStart, lunchEnd})) {
      return true;
    }

    return false;
  }

  async getAppointmentsOfDate(
    dayMonth: string,
  ): Promise<IAppointmentsResult[]> {
    const avaliabledMeetings: IAppointmentsResult[] = [];

    const dateAppointment = TransformAppointmentInDateHelper(dayMonth);

    if (
      dateAppointment === InvalidDateError.INVALID_DATE_DEZEMBER ||
      dateAppointment === InvalidDateError.INVALID_DATE
    ) {
      return [];
    }

    const {startDate, endDate} =
      this.getMaxAndMinAppointmentFromDay(dateAppointment);

    /*
    9:00
     |
    11:00 - 12:00 - marcado
    12:00 - 13:00 OFF
    14:30 - 15:30 - marcado
     |
    19:00
    */
    let currentAppointment = getClone(startDate);
    let count: number = 0;

    const meetsOfDay = await this.findMeetingsOfDayService.execute(startDate);

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

      const hourEndTime = PadStartDateHelper(
        getHours(currentEndAppointment),
        2,
      );

      const minEndTime = PadStartDateHelper(getMins(currentEndAppointment), 2);

      const isLunchTime = this.validateIfAppointmentIsLunchTime(
        currentStartAppointment,
      );

      if (isLunchTime) {
        continue;
      }

      if (
        !this.verifyIfAppointmentIsAvaliable(
          meetsOfDay,
          currentStartAppointment,
          currentEndAppointment,
        )
      ) {
        continue;
      }

      const isAfterNow = isAfter(currentStartAppointment);

      if (!isAfterNow) {
        continue;
      }
      const avaliableAppointment = `${hourStartTime}:${minStartTime} - ${hourEndTime}:${minEndTime}`;

      count++;

      avaliabledMeetings.push({
        option: count,
        description: avaliableAppointment,
      });
    } while (!isSameDate(currentAppointment, endDate));

    return avaliabledMeetings;
  }

  async findAvaliableTime(dayMonth: string): Promise<IOptionsAppointment> {
    let options = await this.getAppointmentsOfDate(dayMonth);

    const formattedOptions = options.map(
      ({option, description}) => `${option}- ${description} \n`,
    );

    const objectListOptions: any = {};
    options.forEach(({option, description}) => {
      objectListOptions[option] = description;
    });
    let response;
    if (options.length > 0) {
      response =
        `Para o dia ${dayMonth} temos esses horários disponiveis, escolha uma das opções abaixo: \n\n${formattedOptions}`.replaceAll(
          ',',
          '',
        );
    } else {
      response = `Para o dia ${dayMonth} não temos horários disponiveis. \n`;
    }

    response += `\n`;
    response += `Digite 0 para escolher outra data`;

    return {options: objectListOptions, response};
  }

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

    const validationDate = AppointmentIsValidHelper(dayMonth);

    if (validationDate === true) {
      return dayMonth;
    }
    return validationDate;
  }

  async execute(accountId: string): Promise<IFlowResult> {
    const appointment = await this.getDateAppointment(accountId);
    if (appointment === INVALID_DATE()) {
      return {
        response: INVALID_DATE(),
        step: this.incompleteStep,
      };
    }
    if (appointment === INVALID_SUNDAY()) {
      return {
        response: INVALID_SUNDAY(),
        step: this.incompleteStep,
      };
    }

    const {options, response} = await this.findAvaliableTime(appointment);

    return {
      response,
      options,
      step: this.stepCompleted,
    };
  }
}
