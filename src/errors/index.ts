import {DefaultError} from './default-errors.enum';
import {InvalidAppointmentError} from './invalid-appointment-error.enum';
import {InvalidDateError} from './invalid-date-error.enum';
import {RetryNewAppointmentDate} from './retry-new-appointment-date.enum';
import {InvalidMenuOptionError} from './invalid-menu-option.enum';
import {STEP_NOT_IMPLEMETED} from './internal/incorrect-param-is-provided.error';
import {MEETING_ALREDY_IN_USE} from './internal/meeting-already-in-use';
import {NotFoundError} from './internal/not-found.error';

export {
  DefaultError,
  InvalidAppointmentError,
  InvalidDateError,
  RetryNewAppointmentDate,
  InvalidMenuOptionError,

  //internal
  STEP_NOT_IMPLEMETED,
  MEETING_ALREDY_IN_USE,
  NotFoundError,
};
