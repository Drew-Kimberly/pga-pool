import { PgaTournament } from './pga-tournament.entity';
import { PgaTournamentService } from './pga-tournament.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PgaTournament])],
  providers: [PgaTournamentService],
  exports: [PgaTournamentService],
})
export class PgaTournamentModule {}
