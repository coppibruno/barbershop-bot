import {MeetingRepository} from '@/repositories';
import {Meetings} from '@prisma/client';
import moment from 'moment';

export const getDateFirstDayOfMonth = () =>
  moment().startOf('month').hours(0).minutes(0).seconds(0).toDate();
export const getDateLastDayOfMonth = () =>
  moment().endOf('month').hours(23).minutes(59).seconds(59).toDate();

/**
 * Classe responsável por verificar se está dentro do limite de 4 agendamentos em um mês por conta
 */
export class ExceededLimitOfMeetingsService {
  constructor(private readonly meetingRepository: MeetingRepository) {
    this.meetingRepository = meetingRepository;
  }

  async findMeetingsFromDate({startDate, endDate, phone}): Promise<Meetings[]> {
    return this.meetingRepository.find({
      where: {
        phone,
        disabledByAdmin: false,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
  /**
   * Retorna true caso o limite esteja dentro do permitido (4 agendamentos por mês e por telefone)
   * @param phone conta do usuario
   * @returns true caso esteja acima limite, false caso não
   */
  async execute(phone: number): Promise<boolean> {
    const startDate = getDateFirstDayOfMonth();
    const endDate = getDateLastDayOfMonth();

    const meetingsFromAccount = await this.findMeetingsFromDate({
      startDate,
      endDate,
      phone,
    });

    return meetingsFromAccount.length >= 4;
  }
}
