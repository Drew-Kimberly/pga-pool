import { DataSource } from 'typeorm';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { createPgaTournament } from '../../../test-helpers/factories';
import { setupTestApp } from '../../../test-helpers/setup-test-app';

import { PgaTournamentService } from './pga-tournament.service';

import { INestApplication } from '@nestjs/common';

describe('PgaTournamentService (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let service: PgaTournamentService;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    service = moduleRef.get(PgaTournamentService);
  });

  afterAll(async () => {
    await app?.close();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getWeeklyTournaments', () => {
    it('returns every tournament in the week, ordered by start_date ASC then id ASC', async () => {
      // Mon May 4 2026 12:00 UTC (8 AM ET)
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-05-04T12:00:00Z'));

      const sharedStart = new Date('2026-05-07T00:00:00Z');
      const sharedEnd = new Date('2026-05-10T23:59:00Z');

      const tournamentB = await createPgaTournament(ds, {
        id: 'R2099weekly-b',
        name: 'Weekly B (May 7)',
        start_date: sharedStart,
        end_date: sharedEnd,
      });
      const tournamentA = await createPgaTournament(ds, {
        id: 'R2099weekly-a',
        name: 'Weekly A (May 7)',
        start_date: sharedStart,
        end_date: sharedEnd,
      });

      const result = await service.getWeeklyTournaments();
      const ids = result.map((t) => t.id);

      expect(ids).toContain(tournamentA.id);
      expect(ids).toContain(tournamentB.id);
      // id ASC tiebreaker on identical start_date
      expect(ids.indexOf(tournamentA.id)).toBeLessThan(ids.indexOf(tournamentB.id));
    });

    it('returns an empty array when nothing in the table is in the week range', async () => {
      // Mon Jun 8 2026 12:00 UTC — pick a quiet week and assert no tournament has a start_date in it.
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-06-08T12:00:00Z'));

      // Create an out-of-window tournament so the table isn't empty.
      await createPgaTournament(ds, {
        id: 'R2099outside-jun',
        start_date: new Date('2026-06-22T00:00:00Z'),
        end_date: new Date('2026-06-25T23:59:00Z'),
      });

      const result = await service.getWeeklyTournaments();
      expect(result).toEqual([]);
    });

    it('excludes tournaments outside the current week range', async () => {
      // Mon Jul 13 2026 12:00 UTC
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-07-13T12:00:00Z'));

      const earlier = await createPgaTournament(ds, {
        id: 'R2099outside-earlier',
        start_date: new Date('2026-07-02T00:00:00Z'),
        end_date: new Date('2026-07-05T23:59:00Z'),
      });
      const later = await createPgaTournament(ds, {
        id: 'R2099outside-later',
        start_date: new Date('2026-07-23T00:00:00Z'),
        end_date: new Date('2026-07-26T23:59:00Z'),
      });
      const inWeek = await createPgaTournament(ds, {
        id: 'R2099outside-inweek',
        start_date: new Date('2026-07-16T00:00:00Z'),
        end_date: new Date('2026-07-19T23:59:00Z'),
      });

      const ids = (await service.getWeeklyTournaments()).map((t) => t.id);
      expect(ids).toContain(inWeek.id);
      expect(ids).not.toContain(earlier.id);
      expect(ids).not.toContain(later.id);
    });
  });
});
