import { PgaTournamentPlayer } from '../../pga-tournament-player/lib/pga-tournament-player.entity';

import { PgaTournamentFieldService } from './pga-tournament-field.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PgaTournamentPlayer])],
  providers: [PgaTournamentFieldService],
  exports: [PgaTournamentFieldService],
})
export class PgaTournamentFieldModule {}
