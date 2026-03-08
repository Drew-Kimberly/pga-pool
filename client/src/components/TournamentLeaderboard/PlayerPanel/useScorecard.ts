import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
 *
 * When `parReferenceRound` is provided (typically a completed round),
 * it is fetched in the background so that `coursePars` contains par
 * values for all 18 holes — even on an in-progress round.
 */
export function useScorecard(
  pgaTournamentPlayerId: string,
  round: number | null,
  parReferenceRound?: number | null
) {
  const [state, setState] = useState<ScorecardState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const cacheRef = useRef<Map<string, Scorecard>>(new Map());
  const [parsRecord, setParsRecord] = useState<Record<number, number>>({});

  const extractPars = useCallback((scorecard: Scorecard) => {
    setParsRecord((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const hole of scorecard.holes) {
        if (next[hole.hole_number] === undefined) {
          next[hole.hole_number] = hole.par;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

  const fetchToCache = useCallback(
    async (playerId: string, roundNum: number): Promise<Scorecard | null> => {
      const cacheKey = `${playerId}-R${roundNum}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) return cached;

      try {
        const res = await pgaPoolApi.pgaTournamentPlayers.getPgaTournamentPlayerScorecard({
          pgaTournamentPlayerId: playerId,
          round: roundNum,
        });
        cacheRef.current.set(cacheKey, res.data);
        return res.data;
      } catch {
        return null;
      }
    },
    []
  );

  // Fetch selected round (updates display state)
  useEffect(() => {
    if (round === null || round <= 0) return;

    const cacheKey = `${pgaTournamentPlayerId}-R${round}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setState({ data: cached, isLoading: false, error: null });
      extractPars(cached);
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetchToCache(pgaTournamentPlayerId, round).then((scorecard) => {
      if (scorecard) {
        setState({ data: scorecard, isLoading: false, error: null });
        extractPars(scorecard);
      } else {
        setState({ data: null, isLoading: false, error: 'Could not load scorecard' });
      }
    });
  }, [pgaTournamentPlayerId, round, fetchToCache, extractPars]);

  // Background fetch of a completed round to seed course pars
  useEffect(() => {
    if (!parReferenceRound || parReferenceRound <= 0) return;

    fetchToCache(pgaTournamentPlayerId, parReferenceRound).then((scorecard) => {
      if (scorecard) extractPars(scorecard);
    });
  }, [pgaTournamentPlayerId, parReferenceRound, fetchToCache, extractPars]);

  const coursePars = useMemo(
    () => new Map(Object.entries(parsRecord).map(([k, v]) => [Number(k), v])),
    [parsRecord]
  );

  return { ...state, coursePars };
}
