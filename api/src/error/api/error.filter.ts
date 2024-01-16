import { Response } from 'express';
import Joi from 'joi';

import { BadRequestResponse, NotFoundResponse } from './error.dto';
import { ErrorResponse } from './error.interface';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  LoggerService,
  Optional,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ErrorFilter extends BaseExceptionFilter implements ExceptionFilter {
  constructor(
    @Optional()
    host?: HttpAdapterHost,
    @Optional()
    private readonly logger: LoggerService = new Logger(ErrorFilter.name)
  ) {
    super(host?.httpAdapter);
  }

  catch(e: unknown, host: ArgumentsHost) {
    this.logError(e);

    const response = this.mapErrorToResponse(e);

    if (response) {
      return host.switchToHttp().getResponse<Response>().status(response.status).json(response);
    } else {
      return super.catch(e, host);
    }
  }

  private mapErrorToResponse(e: unknown): ErrorResponse | undefined {
    if (e instanceof HttpException) {
      if (e.getStatus() === 404) {
        return new NotFoundResponse(e.message);
      }
    } else if (e instanceof Joi.ValidationError) {
      return new BadRequestResponse(e.message);
    }
  }

  private logError(e: unknown) {
    if (this.is4xxError(e)) {
      this.logger.log(`${e}`);
    } else {
      this.logger.error(`${e}`);
    }
  }

  private is4xxError(e: unknown): boolean {
    if (e instanceof HttpException) {
      return e.getStatus().toString().startsWith('4');
    }

    return false;
  }
}
