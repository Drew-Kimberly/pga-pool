import { PgaPlayer } from '../pga-player/lib/pga-player.entity';
import { PgaTournament } from '../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentPlayer } from '../pga-tournament-player/lib/pga-tournament-player.entity';
import { PoolTournament } from '../pool-tournament/lib/pool-tournament.entity';
import { PoolTournamentPlayer } from '../pool-tournament-player/lib/pool-tournament-player.entity';
import { PoolUser } from '../pool-user/lib/pool-user.entity';
import { PoolUserPick } from '../pool-user-pick/lib/pool-user-pick.entity';
import { User } from '../user/lib/user.entity';

import { DatabaseModule } from './database.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule.register([
      PgaPlayer,
      PgaTournament,
      PgaTournamentPlayer,
      User,
      PoolTournament,
      PoolTournamentPlayer,
      PoolUser,
      PoolUserPick,
    ]),
  ],
})
export class RegisteredDatabaseModule {}
