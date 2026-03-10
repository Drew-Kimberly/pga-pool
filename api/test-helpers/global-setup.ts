import fs from 'fs';

import { Client } from 'pg';
import { DataSource } from 'typeorm';

import { League } from '../src/league/lib/league.entity';
import { LeagueUser } from '../src/league-user/lib/league-user.entity';
import { PgaPlayer } from '../src/pga-player/lib/pga-player.entity';
import { PgaTournament } from '../src/pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentPlayer } from '../src/pga-tournament-player/lib/pga-tournament-player.entity';
import { PgaTournamentPlayerHole } from '../src/pga-tournament-player-hole/lib/pga-tournament-player-hole.entity';
import { PgaTournamentPlayerStroke } from '../src/pga-tournament-player-stroke/lib/pga-tournament-player-stroke.entity';
import { Pool } from '../src/pool/lib/pool.entity';
import { PoolTournament } from '../src/pool-tournament/lib/pool-tournament.entity';
import { PoolTournamentPlayer } from '../src/pool-tournament-player/lib/pool-tournament-player.entity';
import { PoolTournamentUser } from '../src/pool-tournament-user/lib/pool-tournament-user.entity';
import { PoolTournamentUserPick } from '../src/pool-tournament-user-pick/lib/pool-tournament-user-pick.entity';
import { PoolUser } from '../src/pool-user/lib/pool-user.entity';
import { User } from '../src/user/lib/user.entity';

const DB_NAME_FILE = '/tmp/.pga-pool-test-db';

const ALL_ENTITIES = [
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
];

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

function getConnectionConfig() {
  return {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5430),
    user: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'postgres',
  };
}

export async function setup() {
  const dbName = `pgapoolapi_test_${randomSuffix()}`;
  const connConfig = getConnectionConfig();

  // 1. Create ephemeral test database + citext extension
  const adminClient = new Client({ ...connConfig, database: 'postgres' });
  await adminClient.connect();
  await adminClient.query(`CREATE DATABASE "${dbName}"`);
  await adminClient.end();

  const dbClient = new Client({ ...connConfig, database: dbName });
  await dbClient.connect();
  await dbClient.query('CREATE EXTENSION IF NOT EXISTS citext');
  await dbClient.end();

  // 2. Use synchronize to create schema from entity metadata
  //    This avoids seed migration FK issues and ESM/CJS interop with migration file loading.
  const ds = new DataSource({
    type: 'postgres',
    host: connConfig.host,
    port: connConfig.port,
    username: connConfig.user,
    password: connConfig.password,
    database: dbName,
    synchronize: true,
    entities: ALL_ENTITIES,
    ssl: false,
  });
  await ds.initialize();
  await ds.destroy();

  // 3. Write DB name for test workers
  fs.writeFileSync(DB_NAME_FILE, dbName, 'utf-8');
}

export async function teardown() {
  const connConfig = getConnectionConfig();

  let dbName: string;
  try {
    dbName = fs.readFileSync(DB_NAME_FILE, 'utf-8').trim();
  } catch {
    return;
  }

  const client = new Client({ ...connConfig, database: 'postgres' });
  await client.connect();

  await client.query(
    `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`,
    [dbName]
  );
  await client.query(`DROP DATABASE IF EXISTS "${dbName}"`);
  await client.end();

  try {
    fs.unlinkSync(DB_NAME_FILE);
  } catch {
    // ignore
  }
}
