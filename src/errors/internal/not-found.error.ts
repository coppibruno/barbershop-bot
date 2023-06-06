export class NotFoundError extends Error {
  constructor(message: string) {
    super(message || 'register not found');
    this.name = 'ValidationError';
  }
}
