import {
  AppointmentIsValidHelper,
  FetchStartAndEndLunchTime,
  TransformAppointmentInDateHelper,
} from '../../helpers';
import {InvalidDateError} from '../../errors';
import {IAppointmentsResult, IFlowResult} from '../../interfaces/flow';
import {FindConversationsService} from '../find-conversation.service';
import {FlowContext} from '../../flow.context';
import moment, {Moment} from 'moment-timezone';
import {FindMeetingsOfDayService} from '../find-meetings-of-day.service';
import {Meetings} from '@prisma/client';
import {PadStartDate} from '../../helpers/padStart';

interface IOptionsAppointment {
  options: string[];
  response: string;
}

export class StepFindAvaliableDateFlow {
  private readonly findConversationService: FindConversationsService;
  private readonly findMeetingsOfDayService: FindMeetingsOfDayService;
  private readonly stepCompleted: number = 4;
  private readonly incompleteStep: number = 3;

  private readonly startAppointmentDay = FlowContext.START_APPOINTMENT_DAY;
  private readonly endAppointmentDay = FlowContext.END_APPOINTMENT_DAY;
  private readonly startSaturdayAppointmentDay =
    FlowContext.START_SATURDAY_APPOINTMENT_DAY;
  private readonly endSaturdayAppointmentDay =
    FlowContext.END_SATURDAY_APPOINTMENT_DAY;
  private readonly startLunchTimeOff: string | boolean =
    FlowContext.getStartLunchTime();
  private readonly endLunchTimeOff: string | boolean =
    FlowContext.getEndLunchTime();
  private readonly appointmentTimeInMinutes =
    FlowContext.APPOINTMENT_TIME_IN_MINUTES;

  constructor(
    findConversationService: FindConversationsService,
    findMeetingsOfDayService: FindMeetingsOfDayService,
  ) {
    this.findConversationService = findConversationService;
    this.findMeetingsOfDayService = findMeetingsOfDayService;
  }

  getStartAndEndDateFromAppointment(date: Moment): {
    startDate: Moment;
    endDate: Moment;
  } {
    const startTime = this.startAppointmentDay.split(':');
    const endTime = this.endAppointmentDay.split(':');

    let startHour = Number(startTime[0]);
    let startMin = Number(startTime[1]);

    let endHour = Number(endTime[0]);
    let endMin = Number(endTime[1]);

    const isSaturday = date.isoWeekday() === 6;

    if (isSaturday) {
      const startTime = this.startSaturdayAppointmentDay.split(':');
      const endTime = this.endSaturdayAppointmentDay.split(':');

      startHour = Number(startTime[0]);
      startMin = Number(startTime[1]);

      endHour = Number(endTime[0]);
      endMin = Number(endTime[1]);
    }

    const start = date.hours(startHour).minutes(startMin).seconds(0).clone();
    const end = date.hours(endHour).minutes(endMin).seconds(0).clone();

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

    const meetExists = meetsOfDay.find((item) => {
      return (
        moment(startAppointment).seconds(1).isAfter(item.startDate) &&
        moment(endAppointment).subtract(1, 'second').isBefore(item.endDate)
      );
    });

    if (meetExists) {
      return false;
    }

    return true;
  }

  validateIfAppointmentIsLunchTime(appointmentStartDate: Moment): boolean {
    if (!this.startLunchTimeOff && !this.endLunchTimeOff) {
      return false;
    }
    const {start, end} = FetchStartAndEndLunchTime(
      String(this.startLunchTimeOff),
      String(this.endLunchTimeOff),
    );

    const day = appointmentStartDate.date();
    const month = appointmentStartDate.month();

    start.date(day).month(month);
    end.date(day).month(month);
    if (
      moment(appointmentStartDate).isAfter(start) &&
      moment(appointmentStartDate).isBefore(end)
    ) {
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
      dateAppointment === InvalidDateError.INVALID_DATE ||
      dateAppointment === InvalidDateError.INVALID_DATE_DEZEMBER
    ) {
      return [];
    }

    const {startDate, endDate} =
      this.getStartAndEndDateFromAppointment(dateAppointment);

    /*
    9:00
     |
    11:00 - 12:00 - marcado
    12:00 - 13:00 OFF
    14:30 - 15:30 - marcado
     |
    19:00
    */
    let currentAppointment = startDate.clone();
    let count: number = 0;

    const meetsOfDay = await this.findMeetingsOfDayService.execute(startDate);

    do {
      const currentStartAppointment = currentAppointment.clone();

      const hourStartTime = PadStartDate(currentStartAppointment.hours(), 2);

      const minStartTime = PadStartDate(currentStartAppointment.minutes(), 2);

      const currentEndAppointment = currentAppointment
        .add(this.appointmentTimeInMinutes, 'minutes')
        .clone();

      const hourEndTime = PadStartDate(currentEndAppointment.hours(), 2);

      const minEndTime = PadStartDate(currentEndAppointment.minutes(), 2);

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

      const isAfterNow = moment(currentStartAppointment).isAfter();

      if (!isAfterNow) {
        continue;
      }
      const avaliableAppointment = `${hourStartTime}:${minStartTime} - ${hourEndTime}:${minEndTime}`;

      count++;

      avaliabledMeetings.push({
        option: count,
        description: avaliableAppointment,
      });
    } while (!currentAppointment.isSame(endDate));

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
      response = `Para o dia ${dayMonth} não temos esses horários disponiveis. \n`;
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
    if (
      appointment === InvalidDateError.INVALID_DATE ||
      appointment === InvalidDateError.INVALID_DATE_DEZEMBER
    ) {
      return {
        response: appointment,
        step: this.incompleteStep,
      };
    }
    if (
      appointment === InvalidDateError.SUNDAY_DATE ||
      appointment === InvalidDateError.SUNDAY_DATE_DEZEMBER
    ) {
      return {
        response: appointment,
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
