import { PgaTournamentPlayer } from '@drewkimberly/pga-pool-api';

export type RoundStatus = 'not_started' | 'complete' | number;

const HOLES_PER_ROUND = 18;

export function getRoundStatus(picks: PgaTournamentPlayer[]): RoundStatus {
  let holesCompleted = 0;

  for (const pick of picks) {
    holesCompleted += pick.is_round_complete ? HOLES_PER_ROUND : pick.score_thru ?? 0;
  }

  if (holesCompleted === 0) {
    return 'not_started';
  }

  if (holesCompleted === picks.length * HOLES_PER_ROUND) {
    return 'complete';
  }

  return Math.round((holesCompleted / (picks.length * HOLES_PER_ROUND)) * 100);
}
