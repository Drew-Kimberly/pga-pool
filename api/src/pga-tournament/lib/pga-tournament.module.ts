import { ListModule } from '../../common/api/list';
import { PgaTourApiModule } from '../../pga-tour-api/lib/v2/pga-tour-api.module';

import { PgaTournament } from './pga-tournament.entity';
import { PgaTournamentIngestor } from './pga-tournament.ingest';
import { PgaTournamentService } from './pga-tournament.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PgaTournament]), PgaTourApiModule, ListModule],
  providers: [PgaTournamentService, PgaTournamentIngestor],
  exports: [PgaTournamentService, PgaTournamentIngestor],
})
export class PgaTournamentModule {}
