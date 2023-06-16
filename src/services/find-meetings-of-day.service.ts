import {Meetings} from '@prisma/client';
import {MeetingRepository} from '@/repositories/meeting.repository';
import {FetchMaxAndMinAppointmentFromDay} from '@/helpers';
import {Moment} from 'moment';

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
    const {startDate, endDate} = FetchMaxAndMinAppointmentFromDay(date);

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
