import {Meetings} from '@prisma/client';
import MeetingRepository from '../repositories/meetingRepository';
import {Moment} from 'moment-timezone';
import {FetchStartAndEndAppointmentTimeHelper} from '../helpers/fetch-start-and-end-appointment-time';
import {FlowContext} from '../flow.context';
import {InvalidDateError} from '../errors';
import {ValidateIfIsDezember} from '../helpers/validate-if-is-dezember';

export class FindMeetingsOfDayService {
  private readonly serviceRepository;

  constructor(serviceRepository: MeetingRepository) {
    this.serviceRepository = serviceRepository;
  }
  /**
   *
   * @param date Data a ser passada para filtrar os agendamentos do dia
   * @returns Lista de <Meetings[]>
   */
  async execute(date: Moment): Promise<Meetings[]> {
    const day = date.date();
    const month = date.month() + 1;
    const year = date.year();

    let dayMonth = `${day}/${month}`;

    if (ValidateIfIsDezember()) {
      dayMonth += `/${year}`;
    }

    const startTime = FlowContext.START_APPOINTMENT_DAY;
    const endTime = FlowContext.END_APPOINTMENT_DAY;

    const workTime = `${startTime} - ${endTime}`;

    const objStartDateEndDate = FetchStartAndEndAppointmentTimeHelper(
      dayMonth,
      workTime,
    );

    if (
      objStartDateEndDate === InvalidDateError.INVALID_DATE ||
      objStartDateEndDate === InvalidDateError.INVALID_DATE_DEZEMBER
    ) {
      return [];
    }

    const {startDate, endDate} = objStartDateEndDate;

    return this.serviceRepository.find({
      where: {
        startDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
      },
    });
  }
}
