import React from 'react';
import { matchPath, useLocation } from 'react-router';

import { resolveDefaultTournament } from '../TournamentLeaderboard/resolveTournament';

import { PgaTournamentTournamentStatusEnum, PoolTournament } from '@drewkimberly/pga-pool-api';

export type PoolNavSection = 'leaderboard' | 'tournaments' | 'standings';

export interface PoolNavModel {
  poolId: string;
  activeSection: PoolNavSection;
  leaderboardPath: string | null;
  tournamentsPath: string;
  standingsPath: string;
  showLeaderboard: boolean;
}

/**
 * Returns true if the tournament has started or starts today (morning of round 1).
 */
function isTournamentLive(tournament: PoolTournament): boolean {
  const status = tournament.pga_tournament.tournament_status;

  if (status === PgaTournamentTournamentStatusEnum.InProgress) {
    return true;
  }

  if (status === PgaTournamentTournamentStatusEnum.NotStarted) {
    const startDate = new Date(tournament.pga_tournament.date.start);
    const now = new Date();
    // Show leaderboard tab starting the morning of round 1
    const morningOfStart = new Date(startDate);
    morningOfStart.setHours(0, 0, 0, 0);
    return now >= morningOfStart;
  }

  return false;
}

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
  const [liveTournament, setLiveTournament] = React.useState<PoolTournament | null>(null);

  const poolId = resolved?.poolId ?? null;

  React.useEffect(() => {
    if (!poolId) return;
    let cancelled = false;

    resolveDefaultTournament(poolId)
      .then((tournament) => {
        if (cancelled) return;
        if (tournament && isTournamentLive(tournament)) {
          setLiveTournament(tournament);
        } else {
          setLiveTournament(null);
        }
      })
      .catch(() => {
        if (!cancelled) setLiveTournament(null);
      });

    return () => {
      cancelled = true;
    };
  }, [poolId]);

  if (!resolved) return null;

  const showLeaderboard = liveTournament !== null;
  const leaderboardPath = liveTournament
    ? `/pools/${resolved.poolId}/tournaments/${liveTournament.id}/leaderboard`
    : null;

  return {
    poolId: resolved.poolId,
    activeSection: resolved.section,
    leaderboardPath,
    tournamentsPath: `/pools/${resolved.poolId}/tournaments`,
    standingsPath: `/pools/${resolved.poolId}/standings`,
    showLeaderboard,
  };
}
