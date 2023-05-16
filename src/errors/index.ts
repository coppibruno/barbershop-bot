import {DefaultError} from './default-errors.enum';
import {InvalidAppointmentError} from './invalid-appointment-error.enum';
import {InvalidDateError} from './invalid-date-error.enum';
import {RetryNewAppointmentDate} from './retry-new-appointment-date.enum';
import {InvalidMenuOptionError} from './invalid-menu-option.enum';
import {IncorrectParamIsProvided} from './internal/incorrect-param-is-provided.error';

export {
  DefaultError,
  InvalidAppointmentError,
  InvalidDateError,
  RetryNewAppointmentDate,
  InvalidMenuOptionError,

  //internal
  IncorrectParamIsProvided,
};
