import {MeetingRepository} from '@/repositories/meeting.repository';

export interface IStartAndEndDate {
  startDate: Date;
  endDate: Date;
}

/**
 * Classe responsável por desabilitar horários passados pelo admin
 */
export class DisableMeetingsOfIntervalService {
  private readonly meetingRepository;

  constructor(meetingRepository: MeetingRepository) {
    this.meetingRepository = meetingRepository;
  }

  async execute({startDate, endDate}: IStartAndEndDate): Promise<void> {
    return this.meetingRepository.upsert(
      {
        where: {
          startDate,
          endDate,
        },
      },
      {
        disabledByAdmin: true,
      },
    );
  }
}
