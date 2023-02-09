import { PgaTourApiService } from './pga-tour-api.service';

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule.register({})],
  providers: [PgaTourApiService],
  exports: [PgaTourApiService],
})
export class PgaTourApiModule {}
