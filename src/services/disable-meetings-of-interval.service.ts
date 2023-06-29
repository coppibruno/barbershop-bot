import {MeetingEntity} from '@/entity';
import {MeetingRepository} from '@/repositories/meeting.repository';
import {Moment} from 'moment';

export interface IStartAndEndDate {
  startDate: Moment;
  endDate: Moment;
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
    const meetingEntity: MeetingEntity = {
      disabledByAdmin: true,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      name: 'bypass-admin',
      phone: 0,
    };
    return this.meetingRepository.create(meetingEntity);
  }
}
