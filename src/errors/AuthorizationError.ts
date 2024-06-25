import { BaseError } from './BaseError';

export class AuthorizationError extends BaseError {
  constructor(message: string, details: string = 'Authorization Error') {
    super(message, 403, details); // 403 Forbidden
  }
}