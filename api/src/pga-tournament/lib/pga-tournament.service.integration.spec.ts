import { DataSource } from 'typeorm';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  createLeague,
  createPgaTournament,
  createPool,
  createPoolTournament,
} from '../../../test-helpers/factories';
import { setupTestApp } from '../../../test-helpers/setup-test-app';
import { HARDCODED_LEAGUE_ID } from '../../league/lib/league.constants';
import { League } from '../../league/lib/league.entity';
import { Pool } from '../../pool/lib/pool.entity';

import { PgaTournamentService } from './pga-tournament.service';

import { INestApplication } from '@nestjs/common';

describe('PgaTournamentService (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let service: PgaTournamentService;
  let league: League;
  let pool: Pool;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    service = moduleRef.get(PgaTournamentService);

    league = await createLeague(ds, { id: HARDCODED_LEAGUE_ID, name: 'Hardcoded League' });
    pool = await createPool(ds, { league });
  });

  afterAll(async () => {
    await app?.close();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getWeeklyTournament', () => {
    it('returns the league tournament when an opposite-field event shares the same start_date', async () => {
      // Mon May 4 2026 12:00 UTC (8 AM ET)
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-05-04T12:00:00Z'));

      const sharedStart = new Date('2026-05-07T00:00:00Z');
      const sharedEnd = new Date('2026-05-10T23:59:00Z');

      const oppositeField = await createPgaTournament(ds, {
        name: 'Opposite-Field Event (May 7)',
        start_date: sharedStart,
        end_date: sharedEnd,
        purse: 4_000_000,
      });
      const inLeague = await createPgaTournament(ds, {
        name: 'Signature Event (May 7)',
        start_date: sharedStart,
        end_date: sharedEnd,
        purse: 20_000_000,
      });

      await createPoolTournament(ds, { pool, league, pgaTournament: inLeague });

      const result = await service.getWeeklyTournament();

      expect(result?.id).toBe(inLeague.id);
      expect(result?.id).not.toBe(oppositeField.id);
    });

    it('returns null when the only tournaments in the week are not in any league pool', async () => {
      // Mon Jun 8 2026 12:00 UTC
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-06-08T12:00:00Z'));

      await createPgaTournament(ds, {
        name: 'Non-league Event (Jun 11)',
        start_date: new Date('2026-06-11T00:00:00Z'),
        end_date: new Date('2026-06-14T23:59:00Z'),
      });

      const result = await service.getWeeklyTournament();
      expect(result).toBeNull();
    });

    it('ignores league tournaments outside the current week range', async () => {
      // Mon Jul 13 2026 12:00 UTC
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-07-13T12:00:00Z'));

      const earlier = await createPgaTournament(ds, {
        name: 'Earlier league event (Jul 2)',
        start_date: new Date('2026-07-02T00:00:00Z'),
        end_date: new Date('2026-07-05T23:59:00Z'),
      });
      await createPoolTournament(ds, { pool, league, pgaTournament: earlier });

      const result = await service.getWeeklyTournament();
      expect(result).toBeNull();
    });
  });
});
