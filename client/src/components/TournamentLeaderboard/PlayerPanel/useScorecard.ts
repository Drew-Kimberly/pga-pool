import { useCallback, useEffect, useRef, useState } from 'react';

import { pgaPoolApi } from '../../../api/pga-pool';

import { Scorecard } from '@drewkimberly/pga-pool-api';

interface ScorecardState {
  data: Scorecard | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches and caches scorecard data for a given player and round.
 * Caches by player+round key to avoid refetching on round tab switches.
 */
export function useScorecard(pgaTournamentPlayerId: string, round: number | null) {
  const [state, setState] = useState<ScorecardState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const cacheRef = useRef<Map<string, Scorecard>>(new Map());

  const fetchScorecard = useCallback(async (playerId: string, roundNum: number) => {
    const cacheKey = `${playerId}-R${roundNum}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setState({ data: cached, isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await pgaPoolApi.pgaTournamentPlayers.getPgaTournamentPlayerScorecard({
        pgaTournamentPlayerId: playerId,
        round: roundNum,
      });
      cacheRef.current.set(cacheKey, res.data);
      setState({ data: res.data, isLoading: false, error: null });
    } catch {
      setState({ data: null, isLoading: false, error: 'Could not load scorecard' });
    }
  }, []);

  useEffect(() => {
    if (round !== null && round > 0) {
      fetchScorecard(pgaTournamentPlayerId, round);
    }
  }, [pgaTournamentPlayerId, round, fetchScorecard]);

  return state;
}
