import { pgaTourApiConfigProvider } from './pga-tour-api.config';
import { PgaTourApiService } from './pga-tour-api.service';
import { UserTrackingIdFactory } from './user-tracking-id-factory.service';

import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule.register({}), ConfigModule, CacheModule.register()],
  providers: [pgaTourApiConfigProvider, PgaTourApiService, UserTrackingIdFactory],
  exports: [PgaTourApiService],
})
export class PgaTourApiModule {}
