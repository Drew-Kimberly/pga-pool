import { Box, Notification, PageContent, Text } from 'grommet';
import { CircleInformation } from 'grommet-icons';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { Spinner } from '../Spinner';

import { PoolStandingsHeader } from './PoolStandingsHeader';
import { PoolStandingsRow } from './PoolStandingsRow';
import { RankedPoolUser } from './types';

import { Pool, PoolTournament, PoolUser } from '@drewkimberly/pga-pool-api';

export interface PoolStandingsProps {
  poolId: string;
}

export function PoolStandings({ poolId }: PoolStandingsProps) {
  const [pool, setPool] = React.useState<Pool | null>(null);
  const [lastOfficialTournament, setLastOfficialTournament] = React.useState<PoolTournament | null>(
    null
  );
  const [poolUsers, setPoolUsers] = React.useState<RankedPoolUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      setFetchError(undefined);

      try {
        const [poolResponse, usersResponse, tournamentsResponse] = await Promise.all([
          pgaPoolApi.pools.getPool({ poolId }),
          pgaPoolApi.poolUsers.listPoolUsers({
            poolId,
            page: { number: 1, size: 200 },
          }),
          pgaPoolApi.poolTournaments.listPoolTournaments({
            poolId,
            page: { number: 1, size: 200 },
          }),
        ]);

        if (!isMounted) {
          return;
        }

        const tournaments = tournamentsResponse.data.data;
        const officialTournament =
          [...tournaments].reverse().find((tournament) => tournament.scores_are_official) ?? null;

        setPool(poolResponse.data);
        setPoolUsers(withFallbackRanks(usersResponse.data.data));
        setLastOfficialTournament(officialTournament);
      } catch (e) {
        if (!isMounted) {
          return;
        }

        if (!pgaPoolApi.is404Error(e as Error)) {
          console.error(e);
          setFetchError(e as Error);
        } else {
          setFetchError(new Error('Pool not found.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [poolId]);

  const rankCounts = React.useMemo(() => {
    const counts = new Map<number, number>();
    for (const user of poolUsers) {
      counts.set(user.rank, (counts.get(user.rank) ?? 0) + 1);
    }
    return counts;
  }, [poolUsers]);

  if (isLoading) {
    return (
      <PageContent>
        <Spinner />
      </PageContent>
    );
  }

  if (fetchError) {
    return (
      <PageContent>
        <Notification
          status="critical"
          title="Could not load standings"
          message={fetchError.message || 'Please refresh and try again.'}
        />
      </PageContent>
    );
  }

  if (!pool) {
    return (
      <PageContent>
        <Box height="medium" round="small" align="center" justify="center" gap="small">
          <CircleInformation size="large" />
          <Text size="large" textAlign="center">
            Pool not found.
          </Text>
        </Box>
      </PageContent>
    );
  }

  return (
    <PageContent pad={{ vertical: 'medium' }}>
      <Box gap="medium">
        <PoolStandingsHeader
          pool={pool}
          usersCount={poolUsers.length}
          lastOfficialTournamentName={
            lastOfficialTournament ? lastOfficialTournament.pga_tournament.name : null
          }
        />

        {poolUsers.length === 0 ? (
          <Box
            pad="large"
            align="center"
            justify="center"
            round="small"
            border={{ size: 'xsmall', color: 'border' }}
          >
            <Text size="medium" textAlign="center">
              No users have joined this pool yet.
            </Text>
          </Box>
        ) : (
          <Box gap="xsmall">
            {poolUsers.map((user) => {
              const rankLabel =
                (rankCounts.get(user.rank) ?? 0) > 1 ? `T${user.rank}` : `${user.rank}`;
              return (
                <PoolStandingsRow
                  key={user.id}
                  user={user}
                  rankLabel={rankLabel}
                  scoreLabel={toPoolScoreLabel(user.pool_score, pool.settings?.scoring_format)}
                />
              );
            })}
          </Box>
        )}
      </Box>
    </PageContent>
  );
}

function withFallbackRanks(users: PoolUser[]): RankedPoolUser[] {
  let previousScore: number | null = null;
  let rank = 0;

  return users.map((user, idx) => {
    const rankedUser = user as RankedPoolUser;

    if (typeof rankedUser.rank === 'number') {
      return rankedUser;
    }

    if (previousScore === null || user.pool_score !== previousScore) {
      rank = idx + 1;
      previousScore = user.pool_score;
    }

    return {
      ...user,
      rank,
    };
  });
}

function toPoolScoreLabel(score: number, scoringFormat: string | undefined): string {
  if (scoringFormat === 'fedex_cup_points') {
    return `${Math.round(score * 10) / 10}`;
  }

  if (score === 0) {
    return 'E';
  }

  if (score > 0) {
    return `+${score}`;
  }

  return `${score}`;
}
