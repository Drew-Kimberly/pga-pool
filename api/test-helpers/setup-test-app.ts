import fs from 'fs';

import { vi } from 'vitest';

import { AppModule } from '../src/app.module';
import { PgaTourApiService } from '../src/pga-tour-api/lib/v2/pga-tour-api.service';

import { Test, TestingModuleBuilder } from '@nestjs/testing';

const DB_NAME_FILE = '/tmp/.pga-pool-test-db';

function getTestDbName(): string {
  return fs.readFileSync(DB_NAME_FILE, 'utf-8').trim();
}

export function createMockPgaTourApiService(): Record<string, ReturnType<typeof vi.fn>> {
  return {
    getPlayers: vi.fn().mockResolvedValue([]),
    getPlayerSeasonResults: vi.fn().mockResolvedValue({ tours: [] }),
    getField: vi.fn().mockResolvedValue({ players: [] }),
    getTournamentSchedule: vi.fn().mockResolvedValue({ completed: [], upcoming: [] }),
    getTournaments: vi.fn().mockResolvedValue([]),
    getCourseStats: vi.fn().mockResolvedValue(null),
    getTournamentLeaderboard: vi.fn().mockResolvedValue({
      leaderboardId: '',
      leaderboard: { players: [], timezone: '', roundStatus: '', tournamentStatus: '', formatType: '' },
    }),
    getLeaderboardHoleByHole: vi.fn().mockResolvedValue({ playerData: [] }),
    getShotDetails: vi.fn().mockResolvedValue(null),
    getProjectedFedexCupPoints: vi.fn().mockResolvedValue({ seasonYear: 0, lastUpdated: '', points: [] }),
  };
}

export function setupTestApp(): TestingModuleBuilder {
  const testDbName = getTestDbName();

  // Set env vars before module creation
  process.env.POSTGRES_HOST = process.env.POSTGRES_HOST ?? 'localhost';
  process.env.POSTGRES_PORT = process.env.POSTGRES_PORT ?? '5430';
  process.env.POSTGRES_USER = process.env.POSTGRES_USER ?? 'postgres';
  process.env.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? 'postgres';
  process.env.POSTGRES_DB = testDbName;
  process.env.POSTGRES_ENABLE_SCHEMA_MIGRATION = 'false';
  process.env.POSTGRES_ENABLE_SSL = 'false';

  // Disable side-effect modules
  process.env.ASYNC_WORKERS_ENABLED = 'false';
  process.env.AUTH_ENABLED = 'false';
  process.env.AUTH_REQUIRED = 'false';

  // Dummy values to prevent config providers from throwing
  process.env.AUTH0_DOMAIN = 'test.auth0.com';
  process.env.AUTH0_AUDIENCE = 'test';
  process.env.PGA_TOUR_API_GQL_URL = 'http://localhost';
  process.env.PGA_TOUR_API_GQL_API_KEY = 'test';

  const mockPgaTourApi = createMockPgaTourApiService();

  return Test.createTestingModule({ imports: [AppModule] }).overrideProvider(PgaTourApiService).useValue(mockPgaTourApi);
}
