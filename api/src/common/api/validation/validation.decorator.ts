import { NotFoundException, Param, ParseUUIDPipe } from '@nestjs/common';

export const UUIDValidationPipe = (urlParamName: string) =>
  Param(
    urlParamName,
    new ParseUUIDPipe({
      exceptionFactory: () => new NotFoundException(),
    })
  );
