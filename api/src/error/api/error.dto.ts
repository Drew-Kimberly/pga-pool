import { ErrorResponse } from './error.interface';

export class BadRequestResponse implements ErrorResponse {
  status: number;
  message: string;
  detail: string | null;

  constructor(detail?: string) {
    this.status = 400;
    this.message = 'Bad Request';
    this.detail = detail ?? null;
  }
}

export class NotFoundResponse implements ErrorResponse {
  status: number;
  message: string;
  detail: string | null;

  constructor(detail?: string) {
    this.status = 404;
    this.message = 'Not Found';
    this.detail = detail ?? null;
  }
}
