import { BaseError } from './BaseError';

export class AuthenticationError extends BaseError {
  constructor(message: string, details: string = 'Authentication Error') {
    super(message, 401, details); // 401 Unauthorized
  }
}
