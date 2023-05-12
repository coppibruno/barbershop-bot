import {Meetings} from '@prisma/client';
import {MeetingRepository} from '../repositories/meeting.repository';
import {Moment} from 'moment-timezone';
import {FetchStartAndEndAppointmentTimeHelper} from '../helpers/fetch-start-and-end-appointment-time.helper';
import {FlowContext} from '../flow.context';
import {InvalidDateError} from '../errors';
import {ValidateIfIsDezemberHelper} from '../helpers/validate-if-is-dezember.helper';

/**
 * Busca uma lista de agendamentos do dia passado por parâmetro
 */
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

    if (ValidateIfIsDezemberHelper()) {
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
