import { DatabaseModule } from '../src/database';
import { PgaPlayer } from '../src/pga-player/lib/pga-player.entity';
import { PgaPlayerModule } from '../src/pga-player/lib/pga-player.module';
import { PgaTourApiModule } from '../src/pga-tour-api/lib/pga-tour-api.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule.register([PgaPlayer]), PgaPlayerModule, PgaTourApiModule],
})
export class PgaPoolCliModule {}
