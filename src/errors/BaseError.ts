export abstract class BaseError extends Error {
    public readonly statusCode: number;
    public readonly details: string;
  
    constructor(message: string, statusCode: number, details: string) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
  
      // Set the prototype explicitly to ensure instanceof works correctly
      Object.setPrototypeOf(this, new.target.prototype);
      Error.captureStackTrace(this, this.constructor);
    }
  
    toJSON() {
      return {
        message: this.message,
        statusCode: this.statusCode,
        details: this.details,
      };
    }
  }