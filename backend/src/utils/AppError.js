/** An expected, client-facing error with an HTTP status code. */
export class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.details = details;
  }
}

export const notFound = (what = 'Resource') => new AppError(404, `${what} not found`);
