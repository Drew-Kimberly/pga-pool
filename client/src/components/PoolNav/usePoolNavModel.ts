import React from 'react';
import { matchPath, useLocation } from 'react-router';

import { resolveDefaultTournament } from '../TournamentLeaderboard/resolveTournament';

import { PgaTournamentTournamentStatusEnum, PoolTournament } from '@drewkimberly/pga-pool-api';

export type PoolNavSection = 'leaderboard' | 'tournaments' | 'standings';

export interface PoolNavModel {
  poolId: string;
  activeSection: PoolNavSection;
  leaderboardPath: string;
  tournamentsPath: string;
  standingsPath: string;
}

/**
 * Returns true if the tournament has started or starts today (morning of round 1).
 * Uses string comparison on YYYY-MM-DD to avoid UTC→local timezone shift bugs.
 */
function isTournamentLive(tournament: PoolTournament): boolean {
  const status = tournament.pga_tournament.tournament_status;

  if (status === PgaTournamentTournamentStatusEnum.InProgress) {
    return true;
  }

  if (status === PgaTournamentTournamentStatusEnum.NotStarted) {
    const startDateStr = tournament.pga_tournament.date.start.slice(0, 10);
    const now = new Date();
    const todayStr = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');
    return todayStr >= startDateStr;
  }

  return false;
}

// Module-level cache to prevent flicker when usePoolNavModel remounts across page navigations
let cachedLiveTournament: PoolTournament | null = null;
let cachedPoolId: string | null = null;

function resolveSection(pathname: string): { poolId: string; section: PoolNavSection } | null {
  // Leaderboard detail
  const leaderboardMatch = matchPath(
    '/pools/:poolId/tournaments/:poolTournamentId/leaderboard',
    pathname
  );
  if (leaderboardMatch?.params.poolId) {
    return { poolId: leaderboardMatch.params.poolId, section: 'leaderboard' };
  }

  // Leaderboard alias
  const leaderboardAliasMatch = matchPath('/pools/:poolId/leaderboard', pathname);
  if (leaderboardAliasMatch?.params.poolId) {
    return { poolId: leaderboardAliasMatch.params.poolId, section: 'leaderboard' };
  }

  // Tournament sub-routes (results, field, overview, base)
  const tournamentDetailMatch = matchPath(
    '/pools/:poolId/tournaments/:poolTournamentId/:tab',
    pathname
  );
  if (tournamentDetailMatch?.params.poolId) {
    return { poolId: tournamentDetailMatch.params.poolId, section: 'tournaments' };
  }

  // Tournament base (index redirect)
  const tournamentBaseMatch = matchPath('/pools/:poolId/tournaments/:poolTournamentId', pathname);
  if (tournamentBaseMatch?.params.poolId) {
    return { poolId: tournamentBaseMatch.params.poolId, section: 'tournaments' };
  }

  // Tournaments list
  const tournamentsMatch = matchPath('/pools/:poolId/tournaments', pathname);
  if (tournamentsMatch?.params.poolId) {
    return { poolId: tournamentsMatch.params.poolId, section: 'tournaments' };
  }

  // Standings
  const standingsMatch = matchPath('/pools/:poolId/standings', pathname);
  if (standingsMatch?.params.poolId) {
    return { poolId: standingsMatch.params.poolId, section: 'standings' };
  }

  return null;
}

export function usePoolNavModel(): PoolNavModel | null {
  const location = useLocation();
  const resolved = resolveSection(location.pathname);
  const poolId = resolved?.poolId ?? null;

  const [liveTournament, setLiveTournament] = React.useState<PoolTournament | null>(
    poolId && poolId === cachedPoolId ? cachedLiveTournament : null
  );

  React.useEffect(() => {
    if (!poolId) return;
    let cancelled = false;

    resolveDefaultTournament(poolId)
      .then((tournament) => {
        if (cancelled) return;
        const live = tournament && isTournamentLive(tournament) ? tournament : null;
        setLiveTournament(live);
        cachedLiveTournament = live;
        cachedPoolId = poolId;
      })
      .catch(() => {
        if (!cancelled) {
          setLiveTournament(null);
          cachedLiveTournament = null;
          cachedPoolId = poolId;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [poolId]);

  if (!resolved) return null;

  const leaderboardPath = liveTournament
    ? `/pools/${resolved.poolId}/tournaments/${liveTournament.id}/leaderboard`
    : `/pools/${resolved.poolId}/leaderboard`;

  return {
    poolId: resolved.poolId,
    activeSection: resolved.section,
    leaderboardPath,
    tournamentsPath: `/pools/${resolved.poolId}/tournaments`,
    standingsPath: `/pools/${resolved.poolId}/standings`,
  };
}
