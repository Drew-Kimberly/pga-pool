import { describe, expect, it, vi } from 'vitest';

import { ScheduleQuery, TournamentsQuery } from '../../pga-tour-api/lib/v2/generated/graphql';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';

import { PgaTournamentIngestor } from './pga-tournament.ingest';
import { PgaTournamentService } from './pga-tournament.service';

import { LoggerService } from '@nestjs/common';

function makeScheduleTournament(
  id: string,
  overrides?: Partial<ScheduleQuery['schedule']['completed'][number]['tournaments'][number]>
): ScheduleQuery['schedule']['completed'][number]['tournaments'][number] {
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
    tournamentStatus: 'COMPLETED' as never,
    roundStatusDisplay: 'Final',
    roundDisplay: 'R4',
    roundStatus: 'OFFICIAL' as never,
    roundStatusColor: 'DEFAULT' as never,
    currentRound: 4,
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

function createMocks() {
  const pgaTournamentService = {
    save: vi.fn().mockResolvedValue([]),
  } as unknown as PgaTournamentService;

  const pgaTourApi = {
    getTournamentSchedule: vi.fn(),
    getTournaments: vi.fn(),
    getCourseStats: vi.fn(),
  } as unknown as PgaTourApiService;

  const logger = {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as unknown as LoggerService;

  const ingestor = new PgaTournamentIngestor(pgaTournamentService, pgaTourApi, logger);

  return { pgaTournamentService, pgaTourApi, logger, ingestor };
}

function setupScheduleAndTournaments(pgaTourApi: PgaTourApiService, tournamentIds: string[]) {
  vi.spyOn(pgaTourApi, 'getTournamentSchedule').mockResolvedValue({
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

  vi.spyOn(pgaTourApi, 'getTournaments').mockResolvedValue(
    tournamentIds.map((id) => makeTournamentData(id))
  );
}

describe('PgaTournamentIngestor', () => {
  describe('courseStats integration', () => {
    it('sets par and yardage from courseStats when available', async () => {
      const { ingestor, pgaTourApi, pgaTournamentService } = createMocks();

      setupScheduleAndTournaments(pgaTourApi, ['R2026003']);

      vi.spyOn(pgaTourApi, 'getCourseStats').mockResolvedValue({
        __typename: 'TournamentHoleStats',
        tournamentId: 'R2026003',
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

      const savedPayload = (pgaTournamentService.save as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(savedPayload).toHaveLength(1);
      expect(savedPayload[0].par).toBe(71);
      expect(savedPayload[0].yardage).toBe(7261);
    });

    it('prefers host course when multiple courses exist', async () => {
      const { ingestor, pgaTourApi, pgaTournamentService } = createMocks();

      setupScheduleAndTournaments(pgaTourApi, ['R2026003']);

      vi.spyOn(pgaTourApi, 'getCourseStats').mockResolvedValue({
        __typename: 'TournamentHoleStats',
        tournamentId: 'R2026003',
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

      const savedPayload = (pgaTournamentService.save as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(savedPayload[0].par).toBe(70);
      expect(savedPayload[0].yardage).toBe(6874);
    });

    it('falls back to first course when no host course is marked', async () => {
      const { ingestor, pgaTourApi, pgaTournamentService } = createMocks();

      setupScheduleAndTournaments(pgaTourApi, ['R2026003']);

      vi.spyOn(pgaTourApi, 'getCourseStats').mockResolvedValue({
        __typename: 'TournamentHoleStats',
        tournamentId: 'R2026003',
        courses: [
          {
            __typename: 'CourseStat',
            courseId: '1',
            courseCode: 'FIRST',
            courseName: 'First Course',
            hostCourse: false,
            par: 72,
            yardage: '7,400',
          },
          {
            __typename: 'CourseStat',
            courseId: '2',
            courseCode: 'SECOND',
            courseName: 'Second Course',
            hostCourse: false,
            par: 71,
            yardage: '7,200',
          },
        ],
      });

      await ingestor.ingest({ yearOverride: 2026 });

      const savedPayload = (pgaTournamentService.save as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(savedPayload[0].par).toBe(72);
      expect(savedPayload[0].yardage).toBe(7400);
    });

    it('does not block ingestion when courseStats fails', async () => {
      const { ingestor, pgaTourApi, pgaTournamentService, logger } = createMocks();

      setupScheduleAndTournaments(pgaTourApi, ['R2026003']);

      vi.spyOn(pgaTourApi, 'getCourseStats').mockRejectedValue(new Error('API unavailable'));

      await ingestor.ingest({ yearOverride: 2026 });

      expect(pgaTournamentService.save).toHaveBeenCalledTimes(1);
      const savedPayload = (pgaTournamentService.save as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(savedPayload).toHaveLength(1);
      expect(savedPayload[0].par).toBeUndefined();
      expect(savedPayload[0].yardage).toBeUndefined();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Could not fetch course stats for R2026003')
      );
    });

    it('leaves par and yardage undefined when courseStats returns no courses', async () => {
      const { ingestor, pgaTourApi, pgaTournamentService } = createMocks();

      setupScheduleAndTournaments(pgaTourApi, ['R2026003']);

      vi.spyOn(pgaTourApi, 'getCourseStats').mockResolvedValue({
        __typename: 'TournamentHoleStats',
        tournamentId: 'R2026003',
        courses: [],
      });

      await ingestor.ingest({ yearOverride: 2026 });

      const savedPayload = (pgaTournamentService.save as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(savedPayload[0].par).toBeUndefined();
      expect(savedPayload[0].yardage).toBeUndefined();
    });
  });
});
