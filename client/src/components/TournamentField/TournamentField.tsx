import { Box, PageContent, Text } from 'grommet';
import { CircleQuestion } from 'grommet-icons';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { Spinner } from '../Spinner';
import { TournamentFieldDisplay } from '../TournamentFieldDisplay';

import {
  PgaTournamentField,
  PgaTournamentFieldPlayerTiersValueInner,
} from '@drewkimberly/pga-pool-api';

export interface TournamentFieldProps {
  pgaTournamentId: string;
}

export function TournamentField(props: TournamentFieldProps) {
  const [field, setField] = React.useState<PgaTournamentField | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    async function fetchTournamentField() {
      setIsLoading(true);
      setFetchError(undefined);

      try {
        const res = await pgaPoolApi.pgaTournaments.getField({
          pgaTournamentId: props.pgaTournamentId,
        });

        Object.keys(res.data.player_tiers).forEach((tier) => {
          res.data.player_tiers[tier].sort(
            (
              a: PgaTournamentFieldPlayerTiersValueInner,
              b: PgaTournamentFieldPlayerTiersValueInner
            ) => (a.name <= b.name ? -1 : 1)
          );
        });

        setField(res.data);
      } catch (e) {
        if (!pgaPoolApi.is404Error(e)) {
          setFetchError(e as Error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchTournamentField();
  }, [props.pgaTournamentId]);

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
        <div>{`Error: ${fetchError}`}</div>
      </PageContent>
    );
  }

  if (!field) {
    return (
      <PageContent>
        <Box height="medium" round="small" align="center" justify="center">
          <CircleQuestion size="large" />
          <Text size="large" textAlign="center" margin="small">
            {`No Player Field found for PGA Tournament ${props.pgaTournamentId}`}
          </Text>
        </Box>
      </PageContent>
    );
  }

  return <TournamentFieldDisplay field={field} />;
}
