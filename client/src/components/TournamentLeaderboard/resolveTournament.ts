import { pgaPoolApi } from '../../api/pga-pool';
import { isInPostTournamentWindow } from '../../utils/postTournamentWindow';

import {
  PgaTournamentTournamentStatusEnum,
  Pool,
  PoolTournament,
} from '@drewkimberly/pga-pool-api';

export const POOL_ID_STORAGE_KEY = 'pga-pool-id';

export async function resolvePoolForLeaderboard(
  poolId: string | null,
  setPoolId?: (value: string | null) => void
): Promise<Pool | null> {
  if (poolId) {
    const poolResponse = await pgaPoolApi.pools.getPool({ poolId });
    return poolResponse.data;
  }

  const poolResponse = await pgaPoolApi.pools.listPools({ page: { number: 1, size: 1 } });
  const firstPool = poolResponse.data.data[0];
  if (firstPool) {
    setPoolId?.(firstPool.id);
    return firstPool;
  }

  return null;
}

export async function resolveDefaultTournament(poolId: string): Promise<PoolTournament | null> {
  const tournamentsResponse = await pgaPoolApi.poolTournaments.listPoolTournaments({
    poolId,
    page: { number: 1, size: 100 },
  });

  return resolveDefaultTournamentFromList(tournamentsResponse.data.data);
}

export async function resolveCurrentWeekTournament(poolId: string): Promise<PoolTournament | null> {
  const [tournamentsResponse, weeklyTournamentId] = await Promise.all([
    pgaPoolApi.poolTournaments.listPoolTournaments({
      poolId,
      page: { number: 1, size: 200 },
    }),
    pgaPoolApi.pgaTournamentField
      .getWeeklyField()
      .then((res) => res.data.pga_tournament.id)
      .catch((e) => {
        if (pgaPoolApi.is404Error(e as Error)) return null;
        throw e;
      }),
  ]);

  return resolveCurrentWeekTournamentFromList(tournamentsResponse.data.data, weeklyTournamentId);
}

export function resolveCurrentWeekTournamentFromList(
  tournaments: PoolTournament[],
  weeklyTournamentId: string | null
): PoolTournament | null {
  if (!tournaments.length) return null;

  const inProgress = tournaments.find(
    (entry) =>
      entry.pga_tournament.tournament_status === PgaTournamentTournamentStatusEnum.InProgress
  );
  if (inProgress) return inProgress;

  const completedPending = tournaments
    .filter(
      (entry) =>
        !entry.scores_are_official &&
        entry.pga_tournament.tournament_status === PgaTournamentTournamentStatusEnum.Completed
    )
    .sort(
      (a, b) =>
        new Date(b.pga_tournament.date.start).getTime() -
        new Date(a.pga_tournament.date.start).getTime()
    );
  if (completedPending.length) return completedPending[0];

  const officialInWindow = tournaments
    .filter(
      (entry) =>
        entry.scores_are_official &&
        entry.pga_tournament.tournament_status === PgaTournamentTournamentStatusEnum.Completed &&
        isInPostTournamentWindow(entry.pga_tournament.date.end)
    )
    .sort(
      (a, b) =>
        new Date(b.pga_tournament.date.start).getTime() -
        new Date(a.pga_tournament.date.start).getTime()
    );
  if (officialInWindow.length) return officialInWindow[0];

  if (weeklyTournamentId) {
    const weekly = tournaments.find((entry) => entry.pga_tournament.id === weeklyTournamentId);
    if (weekly) return weekly;
  }

  return null;
}

export function resolveDefaultTournamentFromList(
  tournaments: PoolTournament[]
): PoolTournament | null {
  if (!tournaments.length) {
    return null;
  }

  const inProgress = tournaments.find(
    (entry) =>
      entry.pga_tournament.tournament_status === PgaTournamentTournamentStatusEnum.InProgress
  );
  if (inProgress) {
    return inProgress;
  }

  const completedInWindow = tournaments.find(
    (entry) =>
      entry.pga_tournament.tournament_status === PgaTournamentTournamentStatusEnum.Completed &&
      isInPostTournamentWindow(entry.pga_tournament.date.end)
  );
  if (completedInWindow) {
    return completedInWindow;
  }

  const upcoming = tournaments.find(
    (entry) =>
      entry.pga_tournament.tournament_status === PgaTournamentTournamentStatusEnum.NotStarted
  );
  if (upcoming) {
    return upcoming;
  }

  for (let i = tournaments.length - 1; i >= 0; i -= 1) {
    if (
      tournaments[i].pga_tournament.tournament_status ===
      PgaTournamentTournamentStatusEnum.Completed
    ) {
      return tournaments[i];
    }
  }

  return tournaments[0];
}
