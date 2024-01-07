import { pgaTourApiConfigProvider } from './pga-tour-api.config';
import { PgaTourApiService } from './pga-tour-api.service';

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule.register({}), ConfigModule],
  providers: [PgaTourApiService, pgaTourApiConfigProvider],
  exports: [PgaTourApiService],
})
export class PgaTourApiModule {}
