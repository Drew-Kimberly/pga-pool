import { matchPath, useLocation } from 'react-router';

export type PoolNavSection = 'leaderboard' | 'tournaments' | 'standings';

export interface PoolNavModel {
  poolId: string;
  activeSection: PoolNavSection;
  leaderboardPath: string;
  tournamentsPath: string;
  standingsPath: string;
}

export function usePoolNavModel(): PoolNavModel | null {
  const location = useLocation();
  const pathname = location.pathname;

  const leaderboardDetailMatch = matchPath(
    { path: '/pools/:poolId/tournaments/:poolTournamentId/leaderboard', end: true },
    pathname
  );
  if (leaderboardDetailMatch?.params.poolId) {
    const poolId = leaderboardDetailMatch.params.poolId;
    const poolTournamentId = leaderboardDetailMatch.params.poolTournamentId;
    return {
      poolId,
      activeSection: 'leaderboard',
      leaderboardPath: poolTournamentId
        ? `/pools/${poolId}/tournaments/${poolTournamentId}/leaderboard`
        : `/pools/${poolId}/leaderboard`,
      tournamentsPath: `/pools/${poolId}/tournaments`,
      standingsPath: `/pools/${poolId}/standings`,
    };
  }

  const leaderboardAliasMatch = matchPath(
    { path: '/pools/:poolId/leaderboard', end: true },
    pathname
  );
  if (leaderboardAliasMatch?.params.poolId) {
    const poolId = leaderboardAliasMatch.params.poolId;
    return {
      poolId,
      activeSection: 'leaderboard',
      leaderboardPath: `/pools/${poolId}/leaderboard`,
      tournamentsPath: `/pools/${poolId}/tournaments`,
      standingsPath: `/pools/${poolId}/standings`,
    };
  }

  const resultsDetailMatch = matchPath(
    { path: '/pools/:poolId/tournaments/:poolTournamentId/results', end: true },
    pathname
  );
  if (resultsDetailMatch?.params.poolId) {
    const poolId = resultsDetailMatch.params.poolId;
    return {
      poolId,
      activeSection: 'tournaments',
      leaderboardPath: `/pools/${poolId}/leaderboard`,
      tournamentsPath: `/pools/${poolId}/tournaments`,
      standingsPath: `/pools/${poolId}/standings`,
    };
  }

  const fieldDetailMatch = matchPath(
    { path: '/pools/:poolId/tournaments/:poolTournamentId/field', end: true },
    pathname
  );
  if (fieldDetailMatch?.params.poolId) {
    const poolId = fieldDetailMatch.params.poolId;
    return {
      poolId,
      activeSection: 'tournaments',
      leaderboardPath: `/pools/${poolId}/leaderboard`,
      tournamentsPath: `/pools/${poolId}/tournaments`,
      standingsPath: `/pools/${poolId}/standings`,
    };
  }

  const tournamentsMatch = matchPath({ path: '/pools/:poolId/tournaments', end: true }, pathname);
  if (tournamentsMatch?.params.poolId) {
    const poolId = tournamentsMatch.params.poolId;
    return {
      poolId,
      activeSection: 'tournaments',
      leaderboardPath: `/pools/${poolId}/leaderboard`,
      tournamentsPath: `/pools/${poolId}/tournaments`,
      standingsPath: `/pools/${poolId}/standings`,
    };
  }

  const standingsMatch = matchPath({ path: '/pools/:poolId/standings', end: true }, pathname);
  if (standingsMatch?.params.poolId) {
    const poolId = standingsMatch.params.poolId;
    return {
      poolId,
      activeSection: 'standings',
      leaderboardPath: `/pools/${poolId}/leaderboard`,
      tournamentsPath: `/pools/${poolId}/tournaments`,
      standingsPath: `/pools/${poolId}/standings`,
    };
  }

  return null;
}
