import { randomUUID } from 'crypto';

import { DataSource } from 'typeorm';

import { PgaTournament } from '../../src/pga-tournament/lib/pga-tournament.entity';
import {
  PgaTournamentRoundStatus,
  PgaTournamentScoringFormat,
  PgaTournamentStatus,
} from '../../src/pga-tournament/lib/pga-tournament.interface';

export async function createPgaTournament(
  ds: DataSource,
  overrides: Partial<PgaTournament> = {}
): Promise<PgaTournament> {
  const suffix = randomUUID().slice(0, 8);
  const id = overrides.id ?? `R2099${suffix}`;

  return ds.getRepository(PgaTournament).save({
    id,
    name: `Test Tournament ${suffix}`,
    tournament_id: suffix,
    year: 2026,
    month: 'January',
    start_date: new Date('2026-01-15'),
    end_date: new Date('2026-01-18'),
    timezone: 'America/New_York',
    display_date: 'Jan 15-18, 2026',
    display_date_short: 'Jan 15-18',
    purse: 20000000,
    features: [],
    fedex_cup_event: true,
    official_fedex_cup_points_calculated: false,
    scoring_format: PgaTournamentScoringFormat.STROKE_PLAY,
    tournament_status: PgaTournamentStatus.IN_PROGRESS,
    round_status: PgaTournamentRoundStatus.IN_PROGRESS,
    current_round: 2,
    course_name: `Test Course ${suffix}`,
    country: 'United States',
    country_code: 'US',
    state: 'Florida',
    state_code: 'FL',
    city: 'Jacksonville',
    ...overrides,
  });
}
