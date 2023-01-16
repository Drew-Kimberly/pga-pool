import { ErrorResponse } from './error.interface';

export class NotFoundResponse implements ErrorResponse {
  constructor(detail?: string) {
    this.status = 404;
    this.message = 'Not Found';
    this.detail = detail ?? null;
  }

  status: number;

  message: string;

  detail: string | null;
}
