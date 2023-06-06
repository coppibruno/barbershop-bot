class MeetingAlredyInUse extends Error {
  constructor() {
    super('appointment already scheduled');
    this.name = 'ValidationError';
  }
}

export const MEETING_ALREDY_IN_USE = new MeetingAlredyInUse();
