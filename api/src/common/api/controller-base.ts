import { HttpException, Logger, LoggerService, Optional } from '@nestjs/common';

export abstract class ControllerBase {
  constructor(
    @Optional()
    protected readonly logger: LoggerService = new Logger(new.target.name)
  ) {}

  protected logErrorSkipping4xx(
    e: Error,
    errorMsg: string | object,
    ctx: Record<string, unknown> = {}
  ) {
    if (e instanceof HttpException && e.getStatus().toString().startsWith('4')) {
      return;
    }

    this.logger.error(errorMsg, e.stack, ctx);
  }
}
