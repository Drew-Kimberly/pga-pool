import { PgaTourApiModule } from '../../pga-tour-api/lib/v2/pga-tour-api.module';

import { PgaPlayer } from './pga-player.entity';
import { PgaPlayerIngestor } from './pga-player.ingest';
import { PgaPlayerService } from './pga-player.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PgaPlayer]), PgaTourApiModule],
  providers: [PgaPlayerService, PgaPlayerIngestor],
  exports: [PgaPlayerService, PgaPlayerIngestor],
})
export class PgaPlayerModule {}
