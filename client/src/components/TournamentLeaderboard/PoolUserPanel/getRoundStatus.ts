import { DateTime } from 'luxon';

import {
  PgaTournament,
  PgaTournamentPlayer,
  PgaTournamentPlayerStatusEnum as PlayerStatus,
  PgaTournamentRoundStatusEnum as TournamentRoundStatus,
} from '@drewkimberly/pga-pool-api';

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

function isCutOrWithdrawn(pick: PgaTournamentPlayer): boolean {
  return (
    pick.withdrawn ||
    pick.current_position === 'CUT' ||
    pick.status === PlayerStatus.Cut ||
    pick.status === PlayerStatus.Wd
  );
}

export function getRoundStatus(
  picks: PgaTournamentPlayer[],
  tournament: PgaTournament
): RoundStatus<'not_started' | 'in_progress' | 'complete'> {
  if (
    tournament.round_status === TournamentRoundStatus.Complete ||
    tournament.round_status === TournamentRoundStatus.Official
  ) {
    return { status: 'complete' };
  }

  let cutWithdrawnCount = 0;
  let activePlayersHolesCompleted = 0;
  const teetimes: DateTime[] = [];

  for (const pick of picks) {
    if (isCutOrWithdrawn(pick)) {
      cutWithdrawnCount++;
    } else {
      activePlayersHolesCompleted += pick.is_round_complete
        ? HOLES_PER_ROUND
        : (pick.score_thru ?? 0);

      if (pick.tee_time) {
        const parsed = teeTimeToDate(pick.tee_time, tournament.date.timezone);
        if (parsed) {
          teetimes.push(parsed);
        }
      }
    }
  }

  const totalHolesCompleted = cutWithdrawnCount * HOLES_PER_ROUND + activePlayersHolesCompleted;

  if (cutWithdrawnCount === picks.length) {
    return { status: 'complete' };
  }

  if (totalHolesCompleted === picks.length * HOLES_PER_ROUND) {
    return { status: 'complete' };
  }

  if (activePlayersHolesCompleted === 0) {
    teetimes.sort((t1, t2) => t1.toUnixInteger() - t2.toUnixInteger());
    return {
      status: 'not_started',
      teetimes,
    };
  }

  return {
    status: 'in_progress',
    percentComplete: Math.round((totalHolesCompleted / (picks.length * HOLES_PER_ROUND)) * 100),
    playersActive: picks.filter((p) => p.active && !p.is_round_complete && !isCutOrWithdrawn(p)),
  };
}

export function teeTimeToDate(teetime: string, tz: string): DateTime | null {
  const trimmed = teetime.trim();

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric) && numeric > 0) {
      const fromEpoch =
        trimmed.length <= 10 ? DateTime.fromSeconds(numeric) : DateTime.fromMillis(numeric);
      if (fromEpoch.isValid) {
        return fromEpoch.toLocal();
      }
    }
    return null;
  }

  const normalizedTeetime =
    (trimmed.endsWith('*')
      ? trimmed.substring(0, trimmed.length - 1).toUpperCase()
      : trimmed.toUpperCase()) +
    ' ' +
    tz;

  const datetime = DateTime.fromFormat(normalizedTeetime, 'h:mma z');
  if (!datetime.isValid) {
    return null;
  }

  return datetime.toLocal();
}
