import { League } from '../league/lib/league.entity';
import { LeagueUser } from '../league-user/lib/league-user.entity';
import { PgaPlayer } from '../pga-player/lib/pga-player.entity';
import { PgaTournament } from '../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentPlayer } from '../pga-tournament-player/lib/pga-tournament-player.entity';
import { PgaTournamentPlayerHole } from '../pga-tournament-player-hole/lib/pga-tournament-player-hole.entity';
import { PgaTournamentPlayerStroke } from '../pga-tournament-player-hole/lib/pga-tournament-player-stroke.entity';
import { Pool } from '../pool/lib/pool.entity';
import { PoolTournament } from '../pool-tournament/lib/pool-tournament.entity';
import { PoolTournamentPlayer } from '../pool-tournament-player/lib/pool-tournament-player.entity';
import { PoolTournamentUser } from '../pool-tournament-user/lib/pool-tournament-user.entity';
import { PoolTournamentUserPick } from '../pool-tournament-user-pick/lib/pool-tournament-user-pick.entity';
import { PoolUser } from '../pool-user/lib/pool-user.entity';
import { User } from '../user/lib/user.entity';

import { DatabaseModule } from './database.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule.register([
      PgaPlayer,
      PgaTournament,
      PgaTournamentPlayer,
      PgaTournamentPlayerHole,
      PgaTournamentPlayerStroke,
      User,
      League,
      LeagueUser,
      Pool,
      PoolUser,
      PoolTournament,
      PoolTournamentPlayer,
      PoolTournamentUser,
      PoolTournamentUserPick,
    ]),
  ],
})
export class RegisteredDatabaseModule {}
