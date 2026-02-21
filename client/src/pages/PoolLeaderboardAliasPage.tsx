import { Box, PageContent, Text } from 'grommet';
import { CircleInformation } from 'grommet-icons';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { pgaPoolApi } from '../api/pga-pool';
import { Spinner } from '../components/Spinner';
import { resolveDefaultTournament } from '../components/TournamentLeaderboard/resolveTournament';

import { withPageLayout } from './withPageLayout';

function _PoolLeaderboardAliasPage() {
  const params = useParams();
  const poolId = params.poolId;
  const [redirectPath, setRedirectPath] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    let isMounted = true;

    async function resolveTournamentRedirect() {
      if (!poolId) {
        setError(new Error('A pool ID is required for this page.'));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(undefined);

      try {
        const tournament = await resolveDefaultTournament(poolId);
        if (!isMounted) {
          return;
        }

        if (!tournament) {
          setError(
            new Error('No PGA Tournament event is currently active! Please check back later')
          );
          return;
        }

        setRedirectPath(`/pools/${poolId}/tournaments/${tournament.id}/leaderboard`);
      } catch (e) {
        if (!isMounted) {
          return;
        }

        if (!pgaPoolApi.is404Error(e as Error)) {
          console.error(e);
          setError(e as Error);
        } else {
          setError(new Error('Pool not found.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    resolveTournamentRedirect();

    return () => {
      isMounted = false;
    };
  }, [poolId]);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  if (isLoading) {
    return (
      <PageContent>
        <Spinner />
      </PageContent>
    );
  }

  if (error) {
    return (
      <PageContent>
        <Box height="medium" round="small" align="center" justify="center">
          <CircleInformation size="large" />
          <Text size="large" textAlign="center" margin="small">
            {error.message}
          </Text>
        </Box>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Box height="medium" round="small" align="center" justify="center">
        <CircleInformation size="large" />
        <Text size="large" textAlign="center" margin="small">
          No PGA Tournament event is currently active! Please check back later
        </Text>
      </Box>
    </PageContent>
  );
}

export const PoolLeaderboardAliasPage = withPageLayout(_PoolLeaderboardAliasPage);
