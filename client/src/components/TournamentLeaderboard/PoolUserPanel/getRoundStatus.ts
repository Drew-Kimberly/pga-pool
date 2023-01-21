import { DateTime } from 'luxon';

import { PgaTournament, PgaTournamentPlayer } from '@drewkimberly/pga-pool-api';

export type RoundStatus<T extends 'not_started' | 'in_progress' | 'complete'> =
  T extends 'not_started'
    ? {
        status: T;
        /** @note sorted ASC in current user's locale */
        teetimes: DateTime[];
      }
    : T extends 'in_progress'
    ? { status: T; percentComplete: number; playersActive: PgaTournamentPlayer[] }
    : { status: T };

const HOLES_PER_ROUND = 18;

export function getRoundStatus(
  picks: PgaTournamentPlayer[],
  tournament: PgaTournament
): RoundStatus<'not_started' | 'in_progress' | 'complete'> {
  let holesCompleted = 0;
  const teetimes: DateTime[] = [];

  for (const pick of picks) {
    holesCompleted += pick.is_round_complete ? HOLES_PER_ROUND : pick.score_thru ?? 0;
    if (pick.tee_time) {
      teetimes.push(teeTimeToDate(pick.tee_time, tournament.date.timezone));
    }
  }

  if (holesCompleted === 0) {
    teetimes.sort((t1, t2) => t1.toUnixInteger() - t2.toUnixInteger());
    return {
      status: 'not_started',
      teetimes,
    };
  }

  if (holesCompleted === picks.length * HOLES_PER_ROUND) {
    return { status: 'complete' };
  }

  return {
    status: 'in_progress',
    percentComplete: Math.round((holesCompleted / (picks.length * HOLES_PER_ROUND)) * 100),
    playersActive: picks.filter((p) => !p.is_round_complete && p.tee_time === null),
  };
}

function teeTimeToDate(teetime: string, tz: string): DateTime {
  const normalizedTeetime =
    (teetime.endsWith('*')
      ? teetime.substring(0, teetime.length - 1).toUpperCase()
      : teetime.toUpperCase()) +
    ' ' +
    tz;

  const datetime = DateTime.fromFormat(normalizedTeetime, 'h:mma z');
  return datetime.toLocal();
}
