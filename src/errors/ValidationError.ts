import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
  constructor(message: string, details: string = 'Validation Error') {
    super(message, 400, details); // 400 Bad Request
  }
}