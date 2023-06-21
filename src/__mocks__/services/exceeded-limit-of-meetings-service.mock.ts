import {Meetings} from '@prisma/client';
import {MeetingRepositoryStub} from '../repositories/meeting-repository.mock';
import {ExceededLimitOfMeetingsService} from '@/services/exceeded-limit-of-meetings.service';
import {GetPhoneByAccountStub} from './get-phone-by-account-service.mock';
import {fakeMeeting} from '../entities';

export const getDateFirstDayOfMonth = () => '2023-06-01T00:00:00.000Z';
export const getDateLastDayOfMonth = () => '2023-06-01T00:00:00.000Z';

export class ExceededLimitOfMeetingsServiceStub extends ExceededLimitOfMeetingsService {
  constructor(
    private readonly meetingRepositoryStub: MeetingRepositoryStub,
    private readonly getPhoneByAccountIdConversationStub: GetPhoneByAccountStub,
  ) {
    super(meetingRepositoryStub, getPhoneByAccountIdConversationStub);
  }

  async findMeetingsFromDate({startDate, endDate, phone}): Promise<Meetings[]> {
    return [fakeMeeting(), fakeMeeting()];
  }
  /**
   * Retorna true caso o limite esteja dentro do permitido (4 agendamentos por mês e por telefone)
   * @param accountId conta do usuario
   * @returns true caso esteja acima limite, false caso não
   */
  async execute(accountId: string): Promise<boolean> {
    const startDate = getDateFirstDayOfMonth();
    const endDate = getDateLastDayOfMonth();

    const phone = this.getPhoneByAccountIdConversationStub.execute(accountId);

    const meetingsFromAccount = await this.findMeetingsFromDate({
      startDate,
      endDate,
      phone,
    });

    return meetingsFromAccount.length >= 4;
  }
}
