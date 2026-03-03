import { Box, Notification, Text } from 'grommet';
import { CircleQuestion } from 'grommet-icons';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { PoolTournamentFieldDisplay } from '../PoolTournamentFieldDisplay';
import { Spinner } from '../Spinner';
import { useTournamentLayoutContext } from '../TournamentLayout/TournamentLayout';

import { PoolTournamentField as PoolTournamentFieldType } from '@drewkimberly/pga-pool-api';

export function PoolTournamentField() {
  const { poolId, tournament } = useTournamentLayoutContext();
  const poolTournamentId = tournament.id;
  const [field, setField] = React.useState<PoolTournamentFieldType | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchField() {
      setIsLoading(true);
      setFetchError(undefined);

      try {
        const res = await pgaPoolApi.poolTournamentField.getPoolTournamentField({
          poolId,
          poolTournamentId,
        });

        if (!isMounted) return;
        setField(res.data);
      } catch (e) {
        if (!isMounted) return;

        if (!pgaPoolApi.is404Error(e as Error)) {
          setFetchError(e as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchField();

    return () => {
      isMounted = false;
    };
  }, [poolId, poolTournamentId]);

  if (isLoading) {
    return <Spinner />;
  }

  if (fetchError) {
    return (
      <Notification
        status="critical"
        title="Could not load field"
        message={fetchError.message || 'Please refresh and try again.'}
      />
    );
  }

  if (!field) {
    return (
      <Box height="medium" round="small" align="center" justify="center">
        <CircleQuestion size="large" />
        <Text size="large" textAlign="center" margin="small">
          No player field found for this tournament.
        </Text>
      </Box>
    );
  }

  return <PoolTournamentFieldDisplay field={field} />;
}
