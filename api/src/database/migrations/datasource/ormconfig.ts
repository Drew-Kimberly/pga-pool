import path from 'path';

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { PgaPlayer } from '../../../pga-player/lib/pga-player.entity';
import { PgaTournament } from '../../../pga-tournament/lib/pga-tournament.entity';

export = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [PgaPlayer, PgaTournament],
  migrations: [path.resolve(__dirname, '..', '*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  ssl: process.env.POSTGRES_ENABLE_SSL !== 'false',
} as PostgresConnectionOptions;