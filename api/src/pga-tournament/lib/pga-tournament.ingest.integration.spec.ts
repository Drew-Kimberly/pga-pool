import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { MockPgaTourApiService, setupTestApp } from '../../../test-helpers/setup-test-app';
import { DomainEventBus } from '../../domain-events/domain-event-bus';
import { ScheduleQuery, TournamentsQuery } from '../../pga-tour-api/lib/v2/generated/graphql';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';

import { PgaTournament } from './pga-tournament.entity';
import { PgaTournamentIngestor } from './pga-tournament.ingest';
import { PgaTournamentStatus } from './pga-tournament.interface';

import { INestApplication } from '@nestjs/common';

type ScheduleTournament = ScheduleQuery['schedule']['completed'][number]['tournaments'][number];

function makeScheduleTournament(
  id: string,
  overrides?: Partial<ScheduleTournament>
): ScheduleTournament {
  return {
    __typename: 'ScheduleTournament',
    id,
    tournamentName: `Tournament ${id}`,
    beautyImage: null,
    champion: 'Prev Champ',
    championEarnings: null,
    championId: '99999',
    city: 'Scottsdale',
    country: 'United States of America',
    countryCode: 'US',
    courseName: 'TPC Test',
    date: 'Jan 1-4',
    dateAccessibilityText: 'January 1 - 4',
    purse: '$10,000,000',
    startDate: Date.now(),
    state: 'Arizona',
    stateCode: 'AZ',
    tournamentLogo: 'logo.png',
    tourStandingHeading: 'FEDEXCUP',
    tourStandingValue: '500 Points',
    ...overrides,
  };
}

function makeTournamentData(
  id: string,
  overrides?: Partial<TournamentsQuery['tournaments'][number]>
): TournamentsQuery['tournaments'][number] {
  return {
    __typename: 'Tournament',
    id,
    tournamentName: `Tournament ${id}`,
    tournamentLogo: [],
    tournamentLocation: 'Scottsdale, AZ',
    tournamentStatus: 'NOT_STARTED' as never,
    roundStatusDisplay: '',
    roundDisplay: '',
    roundStatus: 'UPCOMING' as never,
    roundStatusColor: 'DEFAULT' as never,
    currentRound: 0,
    timezone: 'America/Phoenix',
    seasonYear: '2026',
    displayDate: 'Jan 1 - 4',
    country: 'United States of America',
    state: 'Arizona',
    city: 'Scottsdale',
    scoredLevel: 'MULTI_COURSE' as never,
    infoPath: null,
    formatType: 'STROKE_PLAY' as never,
    features: [],
    events: [],
    courses: [],
    weather: null,
    ...overrides,
  };
}

function stubScheduleAndTournaments(
  mockApi: MockPgaTourApiService,
  tournamentIds: string[],
  tournamentOverrides?: Partial<TournamentsQuery['tournaments'][number]>
) {
  mockApi.getTournamentSchedule.mockResolvedValueOnce({
    __typename: 'Schedule',
    seasonYear: '2026',
    tour: 'R',
    filters: [],
    completed: [
      {
        __typename: 'ScheduleMonth',
        month: 'January',
        year: '2026',
        monthSort: 1,
        tournaments: tournamentIds.map((id) => makeScheduleTournament(id)),
      },
    ],
    upcoming: [],
  });

  mockApi.getTournaments.mockResolvedValueOnce(
    tournamentIds.map((id) => makeTournamentData(id, tournamentOverrides))
  );
}

describe('PgaTournamentIngestor (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let ingestor: PgaTournamentIngestor;
  let mockPgaTourApi: MockPgaTourApiService;
  let eventBus: DomainEventBus;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    ingestor = moduleRef.get(PgaTournamentIngestor);
    mockPgaTourApi = moduleRef.get(PgaTourApiService);
    eventBus = moduleRef.get(DomainEventBus);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('creates new tournaments from schedule API response', async () => {
    const id = `R2026${Date.now().toString().slice(-3)}`;

    stubScheduleAndTournaments(mockPgaTourApi, [id]);
    mockPgaTourApi.getCourseStats.mockResolvedValueOnce(null);

    const saved = await ingestor.ingest({ yearOverride: 2026 });

    expect(saved).toHaveLength(1);

    const dbRow = await ds.getRepository(PgaTournament).findOneBy({ id });
    expect(dbRow).not.toBeNull();
    expect(dbRow?.name).toBe(`Tournament ${id}`);
    expect(dbRow?.course_name).toBe('TPC Test');
    expect(dbRow?.city).toBe('Scottsdale');
    expect(dbRow?.purse).toBe(10_000_000);
    expect(dbRow?.fedex_cup_event).toBe(true);
    expect(dbRow?.tournament_status).toBe(PgaTournamentStatus.NOT_STARTED);
  });

  it('updates existing tournaments on re-ingest (idempotent)', async () => {
    const id = `R2026${Date.now().toString().slice(-3)}`;

    // First ingest: NOT_STARTED
    stubScheduleAndTournaments(mockPgaTourApi, [id]);
    mockPgaTourApi.getCourseStats.mockResolvedValueOnce(null);
    await ingestor.ingest({ yearOverride: 2026 });

    // Second ingest: now IN_PROGRESS with updated name
    stubScheduleAndTournaments(mockPgaTourApi, [id], {
      tournamentStatus: 'IN_PROGRESS' as never,
    });
    mockPgaTourApi.getCourseStats.mockResolvedValueOnce(null);
    await ingestor.ingest({ yearOverride: 2026 });

    const dbRow = await ds.getRepository(PgaTournament).findOneBy({ id });
    expect(dbRow?.tournament_status).toBe(PgaTournamentStatus.IN_PROGRESS);
  });

  it('emits status-updated domain event on status transition', async () => {
    const id = `R2026${Date.now().toString().slice(-3)}`;

    // First ingest to create the tournament
    stubScheduleAndTournaments(mockPgaTourApi, [id]);
    mockPgaTourApi.getCourseStats.mockResolvedValueOnce(null);
    await ingestor.ingest({ yearOverride: 2026 });

    // Listen for the event on the next ingest
    const eventPayloads: unknown[] = [];
    eventBus.on('pga-tournament.status-updated', (payload) => {
      eventPayloads.push(payload);
    });

    // Second ingest: status changes to COMPLETED
    stubScheduleAndTournaments(mockPgaTourApi, [id], {
      tournamentStatus: 'COMPLETED' as never,
    });
    mockPgaTourApi.getCourseStats.mockResolvedValueOnce(null);
    await ingestor.ingest({ yearOverride: 2026 });

    const matching = eventPayloads.filter(
      (p: Record<string, unknown>) => (p.pgaTournament as PgaTournament)?.id === id
    );
    expect(matching).toHaveLength(1);
    expect((matching[0] as Record<string, unknown>).newStatus).toBe(PgaTournamentStatus.COMPLETED);
    expect((matching[0] as Record<string, unknown>).previousStatus).toBe(
      PgaTournamentStatus.NOT_STARTED
    );

    // Clean up listener
    eventBus.removeAllListeners('pga-tournament.status-updated');
  });

  it('persists par and yardage from courseStats API', async () => {
    const id = `R2026${Date.now().toString().slice(-3)}`;

    stubScheduleAndTournaments(mockPgaTourApi, [id]);
    mockPgaTourApi.getCourseStats.mockResolvedValueOnce({
      __typename: 'TournamentHoleStats',
      tournamentId: id,
      courses: [
        {
          __typename: 'CourseStat',
          courseId: '1',
          courseCode: 'TPC',
          courseName: 'TPC Scottsdale',
          hostCourse: true,
          par: 71,
          yardage: '7,261',
        },
      ],
    });

    await ingestor.ingest({ yearOverride: 2026 });

    const dbRow = await ds.getRepository(PgaTournament).findOneBy({ id });
    expect(dbRow?.par).toBe(71);
    expect(dbRow?.yardage).toBe(7261);
  });

  it('prefers host course when multiple courses exist', async () => {
    const id = `R2026${Date.now().toString().slice(-3)}`;

    stubScheduleAndTournaments(mockPgaTourApi, [id]);
    mockPgaTourApi.getCourseStats.mockResolvedValueOnce({
      __typename: 'TournamentHoleStats',
      tournamentId: id,
      courses: [
        {
          __typename: 'CourseStat',
          courseId: '1',
          courseCode: 'SOUTH',
          courseName: 'South Course',
          hostCourse: false,
          par: 72,
          yardage: '7,100',
        },
        {
          __typename: 'CourseStat',
          courseId: '2',
          courseCode: 'NORTH',
          courseName: 'North Course',
          hostCourse: true,
          par: 70,
          yardage: '6,874',
        },
      ],
    });

    await ingestor.ingest({ yearOverride: 2026 });

    const dbRow = await ds.getRepository(PgaTournament).findOneBy({ id });
    expect(dbRow?.par).toBe(70);
    expect(dbRow?.yardage).toBe(6874);
  });

  it('continues ingestion when courseStats API fails', async () => {
    const id = `R2026${Date.now().toString().slice(-3)}`;

    stubScheduleAndTournaments(mockPgaTourApi, [id]);
    mockPgaTourApi.getCourseStats.mockRejectedValueOnce(new Error('API unavailable'));

    const saved = await ingestor.ingest({ yearOverride: 2026 });

    expect(saved).toHaveLength(1);
    const dbRow = await ds.getRepository(PgaTournament).findOneBy({ id });
    expect(dbRow).not.toBeNull();
    expect(dbRow?.par).toBeNull();
    expect(dbRow?.yardage).toBeNull();
  });

  it('does not emit status-updated when status is unchanged', async () => {
    const id = `R2026${Date.now().toString().slice(-3)}`;

    // Create initial tournament
    stubScheduleAndTournaments(mockPgaTourApi, [id]);
    mockPgaTourApi.getCourseStats.mockResolvedValueOnce(null);
    await ingestor.ingest({ yearOverride: 2026 });

    // Listen for events
    const eventPayloads: unknown[] = [];
    eventBus.on('pga-tournament.status-updated', (payload) => {
      eventPayloads.push(payload);
    });

    // Re-ingest with same status
    stubScheduleAndTournaments(mockPgaTourApi, [id]);
    mockPgaTourApi.getCourseStats.mockResolvedValueOnce(null);
    await ingestor.ingest({ yearOverride: 2026 });

    const matching = eventPayloads.filter(
      (p: Record<string, unknown>) => (p.pgaTournament as PgaTournament)?.id === id
    );
    expect(matching).toHaveLength(0);

    eventBus.removeAllListeners('pga-tournament.status-updated');
  });
});
