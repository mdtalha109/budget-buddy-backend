export enum Status {
  success = 'Success',
  error = 'Error',
}

export interface GenericResponse<T> {
  status: Status;
  data: T;
}
