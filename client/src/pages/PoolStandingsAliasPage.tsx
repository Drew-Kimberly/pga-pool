import { Box, PageContent, Text } from 'grommet';
import { CircleInformation } from 'grommet-icons';
import React from 'react';
import { Navigate } from 'react-router';

import { pgaPoolApi } from '../api/pga-pool';
import { resolveActivePoolId } from '../components/PoolStandings';
import { Spinner } from '../components/Spinner';

import { withPageLayout } from './withPageLayout';

function _PoolStandingsAliasPage() {
  const [redirectPath, setRedirectPath] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    let isMounted = true;

    async function resolveActivePool() {
      setIsLoading(true);
      setError(undefined);

      try {
        const activePoolId = await resolveActivePoolId();
        if (!isMounted) {
          return;
        }

        if (!activePoolId) {
          setError(new Error('No pools are available.'));
          return;
        }

        setRedirectPath(`/pools/${activePoolId}/standings`);
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

    resolveActivePool();

    return () => {
      isMounted = false;
    };
  }, []);

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

export const PoolStandingsAliasPage = withPageLayout(_PoolStandingsAliasPage);
