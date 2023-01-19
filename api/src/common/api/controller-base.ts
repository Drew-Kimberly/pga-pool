import { HttpException, LoggerService } from '@nestjs/common';

export abstract class ControllerBase {
  constructor(protected readonly logger: LoggerService) {}

  protected logErrorSkipping4xx(e: Error, errorMsg: string | object) {
    if (e instanceof HttpException && e.getStatus().toString().startsWith('4')) {
      return;
    }

    this.logger.error(errorMsg, e.stack);
  }
}
