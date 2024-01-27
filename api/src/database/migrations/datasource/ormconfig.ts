import path from 'path';

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { League } from '../../../league/lib/league.entity';
import { LeagueUser } from '../../../league-user/lib/league-user.entity';
import { PgaPlayer } from '../../../pga-player/lib/pga-player.entity';
import { PgaTournament } from '../../../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentPlayer } from '../../../pga-tournament-player/lib/pga-tournament-player.entity';
import { Pool } from '../../../pool/lib/pool.entity';
import { PoolTournament } from '../../../pool-tournament/lib/pool-tournament.entity';
import { PoolTournamentPlayer } from '../../../pool-tournament-player/lib/pool-tournament-player.entity';
import { PoolTournamentUser } from '../../../pool-tournament-user/lib/pool-tournament-user.entity';
import { PoolTournamentUserPick } from '../../../pool-tournament-user-pick/lib/pool-tournament-user-pick.entity';
import { PoolUser } from '../../../pool-user/lib/pool-user.entity';
import { User } from '../../../user/lib/user.entity';

export = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    PgaPlayer,
    PgaTournament,
    PgaTournamentPlayer,
    User,
    League,
    LeagueUser,
    Pool,
    PoolUser,
    PoolTournament,
    PoolTournamentPlayer,
    PoolTournamentUser,
    PoolTournamentUserPick,
  ],
  migrations: [path.resolve(__dirname, '..', '*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  ssl: process.env.POSTGRES_ENABLE_SSL !== 'false',
} as PostgresConnectionOptions;
