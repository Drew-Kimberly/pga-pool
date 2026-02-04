import { Box, PageContent, Text } from 'grommet';
import { Calendar, CircleQuestion } from 'grommet-icons';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { Spinner } from '../Spinner';
import { TournamentFieldDisplay } from '../TournamentFieldDisplay';

import { PgaTournamentField, WeeklyPgaTournamentField } from '@drewkimberly/pga-pool-api';

export function WeeklyTournamentField() {
  const [weeklyField, setWeeklyField] = React.useState<WeeklyPgaTournamentField | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [noTournamentThisWeek, setNoTournamentThisWeek] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setFetchError(undefined);
      setNoTournamentThisWeek(false);

      try {
        const res = await pgaPoolApi.pgaTournamentField.getWeeklyField();

        if (!res.headers['content-type']?.startsWith('application/json')) {
          throw new Error(`Unexpected response type: ${res.headers['content-type']}`);
        }

        setWeeklyField(res.data);
      } catch (e) {
        if (pgaPoolApi.is404Error(e as Error)) {
          setNoTournamentThisWeek(true);
        } else {
          setFetchError(e as Error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

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

  if (noTournamentThisWeek) {
    return (
      <PageContent>
        <Box height="medium" round="small" align="center" justify="center">
          <Calendar size="large" />
          <Text size="large" textAlign="center" margin="small">
            No PGA Tournament is scheduled for this week
          </Text>
          <Text size="medium" textAlign="center" color="text-weak">
            Check back closer to the next tournament
          </Text>
        </Box>
      </PageContent>
    );
  }

  // Tournament exists but no field data
  if (weeklyField && !weeklyField.player_tiers) {
    return (
      <PageContent>
        <Box height="medium" round="small" align="center" justify="center">
          <CircleQuestion size="large" />
          <Text size="large" textAlign="center" margin="small">
            {`The player field is not yet available for the ${weeklyField.pga_tournament.date.year} ${weeklyField.pga_tournament.name}`}
          </Text>
          <Text size="medium" textAlign="center" color="text-weak">
            {weeklyField.pga_tournament.date.display}
          </Text>
          <Text size="medium" textAlign="center" color="text-weak" margin={{ top: 'small' }}>
            Check back soon for the tournament field
          </Text>
        </Box>
      </PageContent>
    );
  }

  // Tournament and field both exist
  if (weeklyField && weeklyField.player_tiers) {
    // Cast to PgaTournamentField since we've verified player_tiers is not null
    const field: PgaTournamentField = {
      pga_tournament: weeklyField.pga_tournament,
      created_at: weeklyField.created_at as string,
      player_tiers: weeklyField.player_tiers,
    };
    return <TournamentFieldDisplay field={field} />;
  }

  // Fallback (should not reach here)
  return null;
}
