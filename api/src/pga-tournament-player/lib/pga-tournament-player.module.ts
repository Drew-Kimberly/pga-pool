import { PgaTournamentPlayer } from './pga-tournament-player.entity';
import { PgaTournamentPlayerService } from './pga-tournament-player.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PgaTournamentPlayer])],
  providers: [PgaTournamentPlayerService],
  exports: [PgaTournamentPlayerService],
})
export class PgaTournamentPlayerModule {}
