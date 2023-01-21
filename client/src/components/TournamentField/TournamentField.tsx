import { Box, Grid, Heading, PageContent, ResponsiveContext, Text } from 'grommet';
import { CircleQuestion } from 'grommet-icons';
import React, { useContext } from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { Spinner } from '../Spinner';
import { TournamentHeader } from '../TournamentHeader';

import { PgaTournamentField } from '@drewkimberly/pga-pool-api';

export interface TournamentFieldProps {
  pgaTournamentId: string;
}

export function TournamentField(props: TournamentFieldProps) {
  const [field, setField] = React.useState<PgaTournamentField | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<Error | undefined>(undefined);
  const size = useContext(ResponsiveContext);

  React.useEffect(() => {
    async function fetchTournamentField() {
      setIsLoading(true);
      setFetchError(undefined);

      try {
        const res = await pgaPoolApi.pgaTournaments.getField({
          pgaTournamentId: props.pgaTournamentId,
        });

        Object.keys(res.data.player_tiers).forEach((tier) => {
          res.data.player_tiers[tier].sort((a, b) => (a.name <= b.name ? -1 : 1));
        });

        setField(res.data);
      } catch (e) {
        if (!pgaPoolApi.is404Error(e)) {
          console.error(e);
          setFetchError(e);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchTournamentField();
  }, []);

  return (
    <PageContent>
      {isLoading && <Spinner />}
      {!isLoading && fetchError && <div>{`Error: ${fetchError}`}</div>}
      {!isLoading && !fetchError && !field && (
        <Box height="medium" round="small" align="center" justify="center">
          <CircleQuestion size="large" />
          <Text size="large" textAlign="center" margin="small">
            {`No Player Field found for PGA Tournament ${props.pgaTournamentId}`}
          </Text>
        </Box>
      )}
      {!isLoading && !fetchError && field && (
        <>
          <TournamentHeader tournament={field.pga_tournament} />

          {Object.entries(field.player_tiers).map(([tier, players]) => (
            <>
              <Heading level="3">{`Tier ${tier}`}</Heading>
              <Grid
                columns={{ count: size !== 'small' ? 3 : 2, size: 'auto' }}
                margin={{ bottom: 'medium' }}
              >
                {players.map((player) => (
                  <Text key={player.player_id} margin="xxsmall">
                    {player.name}
                  </Text>
                ))}
              </Grid>
            </>
          ))}
        </>
      )}
    </PageContent>
  );
}
