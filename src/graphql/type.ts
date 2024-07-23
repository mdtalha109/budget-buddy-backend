export enum Status {
  success = 'Success',
  error = 'Error',
}

export interface GenericResponse<T> {
  status: Status;
  data: T;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}
