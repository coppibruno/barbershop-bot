import {Meetings} from '@prisma/client';
import {MeetingRepository} from '@/repositories/meeting.repository';
import {Moment} from 'moment';
import {
  FetchStartAndEndAppointmentTimeHelper,
  ValidateIfIsDezemberHelper,
} from '@/helpers';
import {FlowContext} from '../flow.context';

export const getDay = (date) => date.date();
export const getMonth = (date) => date.month() + 1;
export const getYear = (date) => date.year();

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
    //TODO: trocar para o helper fetch-max-and-min-appointment-from-day.helper
    const day = getDay(date);
    const month = getMonth(date);
    const year = getYear(date);

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
