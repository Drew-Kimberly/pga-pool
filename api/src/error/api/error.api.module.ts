import { ErrorFilter } from './error.filter';

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [{ provide: APP_FILTER, useClass: ErrorFilter }],
})
export class ErrorApiModule {}
