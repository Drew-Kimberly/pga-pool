import { getRoundStatus, teeTimeToDate } from './getRoundStatus';

import {
  PgaTournament,
  PgaTournamentPlayer,
  PgaTournamentPlayerStatusEnum as PlayerStatus,
  PgaTournamentRoundStatusEnum as TournamentRoundStatus,
} from '@drewkimberly/pga-pool-api';

function makePick(overrides: Partial<PgaTournamentPlayer> = {}): PgaTournamentPlayer {
  return {
    id: '1-1',
    active: true,
    status: PlayerStatus.Active,
    is_round_complete: false,
    current_round: 1,
    current_hole: 0,
    starting_hole: 1,
    tee_time: null,
    score_total: 0,
    score_thru: null,
    current_position: null,
    withdrawn: false,
    pga_player: { id: 1, first_name: 'Test', last_name: 'Player', headshot_url: null },
    pga_tournament: {} as PgaTournament,
    ...overrides,
  } as PgaTournamentPlayer;
}

const baseTournament: PgaTournament = {
  id: '1-2026',
  name: 'Test Open',
  date: { timezone: 'America/New_York', start: '2026-02-23', end: '2026-02-26' },
  purse: 1000000,
  fedex_cup_points: 500,
  round_status: TournamentRoundStatus.GroupingsOfficial,
  current_round: 1,
  official_fedex_cup_points_calculated: false,
} as PgaTournament;

describe('teeTimeToDate', () => {
  it('parses a numeric epoch seconds string into a valid DateTime', () => {
    const result = teeTimeToDate('1740000000', 'America/New_York');
    expect(result).not.toBeNull();
    expect(result!.isValid).toBe(true);
    expect(result!.toUnixInteger()).toBe(1740000000);
  });

  it('parses a numeric epoch milliseconds string into a valid DateTime', () => {
    const result = teeTimeToDate('1740000000000', 'America/New_York');
    expect(result).not.toBeNull();
    expect(result!.isValid).toBe(true);
    expect(result!.toMillis()).toBe(1740000000000);
  });

  it('parses a formatted tee time string (e.g. "7:30AM")', () => {
    const result = teeTimeToDate('7:30AM', 'America/New_York');
    expect(result).not.toBeNull();
    expect(result!.isValid).toBe(true);
    const inEastern = result!.setZone('America/New_York');
    expect(inEastern.hour).toBe(7);
    expect(inEastern.minute).toBe(30);
  });

  it('handles asterisk-suffixed tee times (e.g. "7:30am*")', () => {
    const result = teeTimeToDate('7:30am*', 'America/New_York');
    expect(result).not.toBeNull();
    expect(result!.isValid).toBe(true);
    const inEastern = result!.setZone('America/New_York');
    expect(inEastern.hour).toBe(7);
    expect(inEastern.minute).toBe(30);
  });

  it('returns null for an invalid/unparseable string', () => {
    const result = teeTimeToDate('not-a-time', 'America/New_York');
    expect(result).toBeNull();
  });

  it('returns null for an empty numeric string', () => {
    const result = teeTimeToDate('0', 'America/New_York');
    expect(result).toBeNull();
  });
});

describe('getRoundStatus', () => {
  it('returns not_started with valid teetimes from numeric epoch strings', () => {
    const picks = [
      makePick({ tee_time: '1740000000', score_thru: 0 }),
      makePick({ tee_time: '1740003600', score_thru: 0 }),
    ];

    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('not_started');
    if (result.status === 'not_started') {
      expect(result.teetimes).toHaveLength(2);
      expect(result.teetimes[0].isValid).toBe(true);
      expect(result.teetimes[0].toUnixInteger()).toBeLessThanOrEqual(
        result.teetimes[1].toUnixInteger()
      );
    }
  });

  it('returns not_started with empty teetimes when all tee times are invalid', () => {
    const picks = [
      makePick({ tee_time: 'garbage', score_thru: 0 }),
      makePick({ tee_time: 'invalid', score_thru: 0 }),
    ];

    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('not_started');
    if (result.status === 'not_started') {
      expect(result.teetimes).toHaveLength(0);
    }
  });

  it('returns complete when tournament round status is Official', () => {
    const tournament = { ...baseTournament, round_status: TournamentRoundStatus.Official };
    const result = getRoundStatus([makePick()], tournament);
    expect(result.status).toBe('complete');
  });

  it('returns complete when all picks have finished their round', () => {
    const picks = [
      makePick({ is_round_complete: true, status: PlayerStatus.Complete }),
      makePick({ is_round_complete: true, status: PlayerStatus.Complete }),
    ];
    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('complete');
  });

  it('returns in_progress when non-active players have completed their round', () => {
    const picks = [
      makePick({ is_round_complete: true, active: false, status: PlayerStatus.Complete }),
      makePick({ is_round_complete: false, active: false, score_thru: 0, tee_time: '1740000000' }),
      makePick({ is_round_complete: true, active: false, status: PlayerStatus.Complete }),
      makePick({ is_round_complete: false, active: false, score_thru: 0, tee_time: '1740003600' }),
    ];

    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('in_progress');
    if (result.status === 'in_progress') {
      expect(result.percentComplete).toBe(50); // 36 of 72 holes
      expect(result.playersActive).toHaveLength(0);
    }
  });

  it('counts players with active=true and incomplete round as active', () => {
    const picks = [
      makePick({ id: '1', is_round_complete: true, active: false }),
      makePick({ id: '2', is_round_complete: true, active: false }),
      makePick({
        id: '3',
        is_round_complete: false,
        active: false,
        score_thru: 0,
        tee_time: '9999999999999',
      }),
      makePick({
        id: '4',
        is_round_complete: false,
        active: true,
        score_thru: 0,
        tee_time: '1740000000000',
      }),
    ];

    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('in_progress');
    if (result.status === 'in_progress') {
      expect(result.playersActive).toHaveLength(1);
      expect(result.playersActive[0].id).toBe('4');
    }
  });

  it('treats withdrawn players as round complete for progress calculation', () => {
    const picks = [
      makePick({
        id: '1',
        is_round_complete: false,
        active: false,
        score_thru: 0,
        withdrawn: true,
        status: PlayerStatus.Wd,
      }),
      makePick({ id: '2', is_round_complete: false, active: true, score_thru: 9 }),
    ];

    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('in_progress');
    if (result.status === 'in_progress') {
      expect(result.percentComplete).toBe(75); // (18 + 9) of 36 holes
      expect(result.playersActive).toHaveLength(1);
      expect(result.playersActive[0].id).toBe('2');
    }
  });

  it('returns not_started when withdrawn player present but active player has not teed off', () => {
    const picks = [
      makePick({
        id: '1',
        is_round_complete: false,
        active: false,
        score_thru: 0,
        withdrawn: true,
        status: PlayerStatus.Wd,
        tee_time: '1740000000',
      }),
      makePick({
        id: '2',
        is_round_complete: false,
        active: true,
        score_thru: 0,
        tee_time: '1740003600',
      }),
    ];

    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('not_started');
    if (result.status === 'not_started') {
      expect(result.teetimes).toHaveLength(1);
      expect(result.teetimes[0].toUnixInteger()).toBe(1740003600);
    }
  });

  it('returns not_started when 3/4 players are cut/withdrawn and 1 has not started', () => {
    const picks = [
      makePick({
        id: '1',
        withdrawn: true,
        status: PlayerStatus.Wd,
        active: false,
        tee_time: '1740000000',
      }),
      makePick({
        id: '2',
        current_position: 'CUT',
        status: PlayerStatus.Cut,
        active: false,
        tee_time: '1740001000',
      }),
      makePick({
        id: '3',
        status: PlayerStatus.Cut,
        active: false,
        tee_time: '1740002000',
      }),
      makePick({
        id: '4',
        active: true,
        score_thru: 0,
        tee_time: '1740005000',
      }),
    ];

    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('not_started');
    if (result.status === 'not_started') {
      expect(result.teetimes).toHaveLength(1);
      expect(result.teetimes[0].toUnixInteger()).toBe(1740005000);
    }
  });

  it('returns in_progress at ~76% when 3/4 cut/withdrawn and 1 on hole 1', () => {
    const picks = [
      makePick({ id: '1', withdrawn: true, status: PlayerStatus.Wd, active: false }),
      makePick({ id: '2', current_position: 'CUT', status: PlayerStatus.Cut, active: false }),
      makePick({ id: '3', status: PlayerStatus.Cut, active: false }),
      makePick({ id: '4', active: true, score_thru: 1 }),
    ];

    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('in_progress');
    if (result.status === 'in_progress') {
      // (18 + 18 + 18 + 1) / 72 = 55/72 ≈ 76%
      expect(result.percentComplete).toBe(76);
      expect(result.playersActive).toHaveLength(1);
      expect(result.playersActive[0].id).toBe('4');
    }
  });

  it('returns complete when all 4 picks are cut or withdrawn', () => {
    const picks = [
      makePick({ id: '1', current_position: 'CUT', active: false, tee_time: '1740000000' }),
      makePick({
        id: '2',
        current_position: 'CUT',
        status: PlayerStatus.Cut,
        active: false,
        tee_time: '1740001000',
      }),
      makePick({ id: '3', status: PlayerStatus.Cut, active: false, tee_time: '1740002000' }),
      makePick({
        id: '4',
        withdrawn: true,
        status: PlayerStatus.Wd,
        active: false,
        tee_time: '1740003000',
      }),
    ];

    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('complete');
  });

  it('treats cut player the same as withdrawn for progress calculation', () => {
    const picks = [
      makePick({
        id: '1',
        current_position: 'CUT',
        status: PlayerStatus.Cut,
        active: false,
      }),
      makePick({ id: '2', active: true, score_thru: 9 }),
    ];

    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('in_progress');
    if (result.status === 'in_progress') {
      expect(result.percentComplete).toBe(75); // (18 + 9) of 36 holes
      expect(result.playersActive).toHaveLength(1);
      expect(result.playersActive[0].id).toBe('2');
    }
  });

  it('returns in_progress with percentComplete when some holes are completed', () => {
    const picks = [
      makePick({ score_thru: 9, is_round_complete: false }),
      makePick({ score_thru: 0, is_round_complete: false, tee_time: null }),
    ];

    const result = getRoundStatus(picks, baseTournament);
    expect(result.status).toBe('in_progress');
    if (result.status === 'in_progress') {
      expect(result.percentComplete).toBe(25); // 9 of 36 holes
    }
  });
});
