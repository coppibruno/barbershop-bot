class IncorrectParamIsProvided extends Error {
  constructor() {
    super('Incorrect param is provided');
    this.name = 'ValidationError';
  }
}

export const STEP_NOT_IMPLEMETED = new IncorrectParamIsProvided();
