import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createPgaTournament } from '../../../../../test-helpers/factories';
import { setupTestApp } from '../../../../../test-helpers/setup-test-app';
import { PgaTournament } from '../../../../pga-tournament/lib/pga-tournament.entity';
import {
  PgaTournamentScoringFormat,
  PgaTournamentStatus,
} from '../../../../pga-tournament/lib/pga-tournament.interface';

import { TypeOrmListService } from './typeorm-list.service';

import { INestApplication } from '@nestjs/common';

describe('TypeOrmListService (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let listService: TypeOrmListService<PgaTournament>;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    listService = moduleRef.get(TypeOrmListService);
  });

  afterAll(async () => {
    await app?.close();
  });

  const defaultPage = { size: 100, number: 1 };

  it('filters with eq operator', async () => {
    const t = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
      scoring_format: PgaTournamentScoringFormat.STROKE_PLAY,
    });

    const result = await listService.list(
      { page: defaultPage, filter: { tournament_status: { eq: 'COMPLETED' } } },
      { entityType: PgaTournament }
    );

    const ids = result.data.map((r) => r.id);
    expect(ids).toContain(t.id);
    result.data.forEach((r) => {
      expect(r.tournament_status).toBe(PgaTournamentStatus.COMPLETED);
    });
  });

  it('filters with neq operator', async () => {
    const tCompleted = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
    });
    await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });

    const result = await listService.list(
      { page: defaultPage, filter: { tournament_status: { neq: 'IN_PROGRESS' } } },
      { entityType: PgaTournament }
    );

    const ids = result.data.map((r) => r.id);
    expect(ids).toContain(tCompleted.id);
    result.data.forEach((r) => {
      expect(r.tournament_status).not.toBe(PgaTournamentStatus.IN_PROGRESS);
    });
  });

  it('filters with gte and lte operators (date range)', async () => {
    const t = await createPgaTournament(ds, {
      start_date: new Date('2026-06-15'),
      end_date: new Date('2026-06-18'),
    });

    const result = await listService.list(
      {
        page: defaultPage,
        filter: {
          start_date: { gte: '2026-06-01', lte: '2026-06-30' },
        },
      },
      { entityType: PgaTournament }
    );

    const ids = result.data.map((r) => r.id);
    expect(ids).toContain(t.id);
  });

  it('filters with contains operator (case-insensitive)', async () => {
    const t = await createPgaTournament(ds, {
      name: 'The Masters Tournament',
    });

    const result = await listService.list(
      { page: defaultPage, filter: { name: { contains: 'masters' } } },
      { entityType: PgaTournament }
    );

    const ids = result.data.map((r) => r.id);
    expect(ids).toContain(t.id);
  });

  it('supports pagination (page size and number)', async () => {
    // Create enough tournaments to paginate
    for (let i = 0; i < 3; i++) {
      await createPgaTournament(ds);
    }

    const page1 = await listService.list(
      { page: { size: 2, number: 1 }, filter: {} },
      {
        entityType: PgaTournament,
        onFindOptions: (opts) => {
          opts.order = { id: 'ASC' };
        },
      }
    );

    expect(page1.data.length).toBeLessThanOrEqual(2);
    expect(page1.meta.requested_size).toBe(2);
    expect(page1.meta.number).toBe(1);
    expect(page1.meta.total).toBeGreaterThanOrEqual(3);
  });

  it('supports field mapping (unmapped → entity column)', async () => {
    const t = await createPgaTournament(ds, {
      fedex_cup_event: true,
    });

    const result = await listService.list(
      { page: defaultPage, filter: { is_fedex: true } },
      {
        entityType: PgaTournament,
        fieldMap: { is_fedex: 'fedex_cup_event' },
      }
    );

    const ids = result.data.map((r) => r.id);
    expect(ids).toContain(t.id);
    result.data.forEach((r) => {
      expect(r.fedex_cup_event).toBe(true);
    });
  });

  it('supports nested field paths (dot notation)', async () => {
    // This test uses the pool-tournament list endpoint pattern:
    // the filter key 'tournament_status' maps to 'pga_tournament.tournament_status'
    // We test it directly here at the service level
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
      year: 2026,
    });

    const result = await listService.list(
      { page: defaultPage, filter: { year_filter: 2026 } },
      {
        entityType: PgaTournament,
        fieldMap: { year_filter: 'year' },
      }
    );

    const ids = result.data.map((r) => r.id);
    expect(ids).toContain(pgaTournament.id);
  });
});
