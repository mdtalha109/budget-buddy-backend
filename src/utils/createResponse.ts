import { ApiResponse } from "../graphql/type";

export const createResponse = <T>(success: boolean, data: T | null, message: string): ApiResponse<T> => {
    return {
      success,
      data: success ? data : null,
      message,
    };
  };