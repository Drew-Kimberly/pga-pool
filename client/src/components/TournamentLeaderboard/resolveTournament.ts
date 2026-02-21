import { pgaPoolApi } from '../../api/pga-pool';

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
