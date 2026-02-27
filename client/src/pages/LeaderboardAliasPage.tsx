import { Box, PageContent, Text } from 'grommet';
import { CircleInformation } from 'grommet-icons';
import React from 'react';
import { Navigate } from 'react-router';

import { pgaPoolApi } from '../api/pga-pool';
import { SessionStorage } from '../api/storage';
import { Spinner } from '../components/Spinner';
import {
  POOL_ID_STORAGE_KEY,
  resolvePoolForLeaderboard,
} from '../components/TournamentLeaderboard/resolveTournament';
import { usePersistedState } from '../hooks';

import { withPageLayout } from './withPageLayout';

function _LeaderboardAliasPage() {
  const [poolId, setPoolId] = usePersistedState<string | null>(
    null,
    POOL_ID_STORAGE_KEY,
    new SessionStorage()
  );
  const [redirectPath, setRedirectPath] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    let isMounted = true;

    async function resolvePoolRedirect() {
      setIsLoading(true);
      setError(undefined);

      try {
        const resolvedPool = await resolvePoolForLeaderboard(poolId, setPoolId);
        if (!isMounted) {
          return;
        }

        if (!resolvedPool) {
          setError(new Error('No pools are available.'));
          return;
        }

        setRedirectPath(`/pools/${resolvedPool.id}/leaderboard`);
      } catch (e) {
        if (!isMounted) {
          return;
        }

        if (!pgaPoolApi.is404Error(e as Error)) {
          console.error(e);
          setError(e as Error);
        } else {
          setError(new Error('No pools are available.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    resolvePoolRedirect();

    return () => {
      isMounted = false;
    };
  }, [poolId, setPoolId]);

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
        <Box height="medium" round="small" align="center" justify="center" gap="small">
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
      <Box height="medium" round="small" align="center" justify="center" gap="small">
        <CircleInformation size="large" />
        <Text size="large" textAlign="center" margin="small">
          No pools are available.
        </Text>
      </Box>
    </PageContent>
  );
}

export const LeaderboardAliasPage = withPageLayout(_LeaderboardAliasPage);
