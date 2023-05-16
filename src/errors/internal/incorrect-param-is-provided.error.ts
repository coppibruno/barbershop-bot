export class IncorrectParamIsProvided extends Error {
  constructor() {
    super('Incorrect param is provided');
    this.name = 'ValidationError';
  }
}
