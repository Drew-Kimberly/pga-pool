/* eslint-disable no-unreachable */
import {
  Accordion,
  Anchor,
  Box,
  Notification,
  PageContent,
  ResponsiveContext,
  Text,
} from 'grommet';
import { CircleInformation } from 'grommet-icons';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { LocalStorage, SessionStorage } from '../../api/storage';
import { useInterval, usePersistedState } from '../../hooks';
import { Spinner } from '../Spinner';
import { Toggle } from '../Toggle';
import { TournamentHeader } from '../TournamentHeader';

import { PgaPlayerName } from './PgaPlayerName';
import { PoolUserPanel } from './PoolUserPanel';
import { RankType } from './types';
import { getEffectiveFedexCupPoints, toFedexCupPointsString, toScoreString } from './utils';

import {
  PgaTournamentTournamentStatusEnum,
  Pool,
  PoolTournament,
  PoolTournamentUser,
} from '@drewkimberly/pga-pool-api';

const USERS_POLL_INTERVAL = 30 * 1000; // 30s
const TOURNAMENT_POLL_INTERVAL = 5 * 60 * 1000; // 5 min
const POOL_ID_STORAGE_KEY = 'pga-pool-id';

export function TournamentLeaderboard() {
  const [poolId, setPoolId] = usePersistedState<string | null>(
    null,
    POOL_ID_STORAGE_KEY,
    new SessionStorage()
  );
  const [tournament, setTournament] = React.useState<PoolTournament | undefined>(undefined);
  const [poolUsers, setPoolUsers] = React.useState<PoolTournamentUser[]>([]);
  const [rankType, setRankType] = usePersistedState<RankType>('score', `rank-type-selection`);
  const [isLoading, setIsLoading] = React.useState(true);
  const [initialFetchError, setInitialFetchError] = React.useState<Error | undefined>(undefined);
  const [pollErrorCount, setPollErrorCount] = React.useState(0);
  const size = React.useContext(ResponsiveContext);

  React.useEffect(() => {
    async function fetchPoolAndTournament() {
      setIsLoading(true);
      setInitialFetchError(undefined);

      try {
        const resolvedPool = await resolvePool(poolId, setPoolId);
        if (!resolvedPool) {
          setTournament(undefined);
          setPoolUsers([]);
          return;
        }

        const rankTypeStorage = new LocalStorage();
        const storedRankType = rankTypeStorage.get<RankType>('rank-type-selection');
        if (!storedRankType) {
          const defaultRankType =
            resolvedPool.settings?.scoring_format === 'fedex_cup_points'
              ? 'fedex_cup_points'
              : 'score';
          setRankType(defaultRankType);
        }

        const currentTournament = await resolveCurrentTournament(resolvedPool.id);
        setTournament(currentTournament ?? undefined);

        if (currentTournament) {
          const usersResponse = await pgaPoolApi.poolTournaments.listPoolTournamentUsers({
            poolId: resolvedPool.id,
            poolTournamentId: currentTournament.id,
            page: { number: 1, size: 200 },
          });
          setPoolUsers(usersResponse.data.data);
        } else {
          setPoolUsers([]);
        }
      } catch (e) {
        if (!pgaPoolApi.is404Error(e)) {
          console.error(e);
          setInitialFetchError(e);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchPoolAndTournament();
  }, []);

  useInterval(async () => {
    if (!poolId || !tournament?.id) {
      return;
    }

    try {
      const usersResponse = await pgaPoolApi.poolTournaments.listPoolTournamentUsers({
        poolId,
        poolTournamentId: tournament.id,
        page: { number: 1, size: 200 },
      });
      setPollErrorCount(0);
      setPoolUsers(usersResponse.data.data);
    } catch (e) {
      if (!pgaPoolApi.is404Error(e)) {
        console.error(e);
        setPollErrorCount((prev) => prev + 1);
      }
    }
  }, USERS_POLL_INTERVAL);

  useInterval(async () => {
    if (!poolId || !tournament?.id) {
      return;
    }

    try {
      const tournamentResponse = await pgaPoolApi.poolTournaments.getPoolTournament({
        poolId,
        poolTournamentId: tournament.id,
      });
      setPollErrorCount(0);
      setTournament(tournamentResponse.data);
    } catch (e) {
      if (!pgaPoolApi.is404Error(e)) {
        console.error(e);
        setPollErrorCount((prev) => prev + 1);
      }
    }
  }, TOURNAMENT_POLL_INTERVAL);

  React.useMemo(() => {
    poolUsers.sort((a, b) => {
      if (rankType === 'score') {
        return (a.score ?? 0) - (b.score ?? 0);
      } else if (rankType === 'fedex_cup_points') {
        const aPoints = a.fedex_cup_points ?? 0;
        const bPoints = b.fedex_cup_points ?? 0;
        return bPoints - aPoints;
      } else {
        throw new Error(`Unsupported leaderboard rank type: ${rankType}`);
      }
    });
  }, [rankType, poolUsers]);

  const round = poolUsers[0]?.picks[0]?.pga_tournament_player?.current_round ?? undefined;

  return (
    <PageContent>
      {isLoading && <Spinner />}
      {!isLoading && initialFetchError && <div>{`Error: ${initialFetchError}`}</div>}
      {!isLoading && !initialFetchError && !tournament && (
        <Box height="medium" round="small" align="center" justify="center">
          <CircleInformation size="large" />
          <Text size="large" textAlign="center" margin="small">
            No PGA Tournament event is currently active! <br /> Please check back later
          </Text>
        </Box>
      )}
      {!isLoading && !initialFetchError && tournament && poolUsers.length === 0 && (
        <>
          <TournamentHeader tournament={tournament.pga_tournament} round={round} />
          <Box height="medium" round="small" align="center" justify="center">
            <CircleInformation size="large" />
            <Text size="large" textAlign="center" margin="small">
              This tournament is not live yet. Picks have not been submitted.
            </Text>
            <Anchor href="/pga-tournaments/weekly-field" label="View the weekly field" />
          </Box>
        </>
      )}
      {!isLoading && !initialFetchError && tournament && poolUsers.length > 0 && (
        <>
          <TournamentHeader tournament={tournament.pga_tournament} round={round} />

          {pollErrorCount >= 2 && (
            <Notification status="critical" message="Error refreshing tournament scores" />
          )}

          <Box
            fill="horizontal"
            align={size === 'small' ? 'start' : 'end'}
            pad={size === 'small' ? { top: 'large', bottom: 'medium' } : undefined}
          >
            <Toggle
              label={
                <Text size="small">{size !== 'small' ? 'FedEx Cup Points' : 'FedEx Points'}</Text>
              }
              checked={rankType === 'fedex_cup_points'}
              onChange={(event) => setRankType(event.target.checked ? 'fedex_cup_points' : 'score')}
            />
          </Box>

          <Accordion margin={{ bottom: 'medium', top: 'medium' }}>
            {poolUsers.map((user) => (
              <PoolUserPanel
                key={user.id}
                user={user}
                pgaTournament={tournament.pga_tournament}
                tournamentRound={round ?? undefined}
                rankType={rankType}
              >
                {user.picks.map((pick) => (
                  <Box key={pick.pga_tournament_player.id} pad="small" direction="row">
                    <PgaPlayerName player={pick.pga_tournament_player} />
                    <Text weight={'bold'}>
                      {rankType === 'score'
                        ? toScoreString(pick.pga_tournament_player.score_total)
                        : toFedexCupPointsString(
                            getEffectiveFedexCupPoints(pick.pga_tournament_player)
                          )}
                    </Text>
                  </Box>
                ))}
              </PoolUserPanel>
            ))}
          </Accordion>
        </>
      )}
    </PageContent>
  );
}

async function resolvePool(
  poolId: string | null,
  setPoolId: (value: string | null) => void
): Promise<Pool | null> {
  if (poolId) {
    const poolResponse = await pgaPoolApi.pools.getPool({ poolId });
    return poolResponse.data;
  }

  const poolResponse = await pgaPoolApi.pools.listPools({ page: { number: 1, size: 1 } });
  const firstPool = poolResponse.data.data[0];
  if (firstPool) {
    setPoolId(firstPool.id);
    return firstPool;
  }

  return null;
}

async function resolveCurrentTournament(poolId: string): Promise<PoolTournament | null> {
  const tournamentsResponse = await pgaPoolApi.poolTournaments.listPoolTournaments({
    poolId,
    page: { number: 1, size: 100 },
  });
  const tournaments = tournamentsResponse.data.data;
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
