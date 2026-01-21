import { Box, PageContent, Text } from 'grommet';
import { Calendar, CircleQuestion } from 'grommet-icons';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { getTournamentOfTheWeek } from '../../utils/getTournamentOfTheWeek';
import { Spinner } from '../Spinner';
import { TournamentFieldDisplay } from '../TournamentFieldDisplay';

import {
  PgaTournament,
  PgaTournamentField,
  PgaTournamentFieldPlayerTiersValueInner,
} from '@drewkimberly/pga-pool-api';

export function WeeklyTournamentField() {
  const [tournament, setTournament] = React.useState<PgaTournament | undefined>(undefined);
  const [field, setField] = React.useState<PgaTournamentField | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [noTournamentThisWeek, setNoTournamentThisWeek] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setFetchError(undefined);
      setNoTournamentThisWeek(false);

      try {
        // Step 1: Fetch tournaments (the utility will filter by week boundaries)
        const tournamentsRes = await pgaPoolApi.pgaTournaments.listPgaTournaments({});

        // Step 2: Find tournament of the week (client-side filtering)
        const weeklyTournament = getTournamentOfTheWeek(tournamentsRes.data.data);

        if (!weeklyTournament) {
          setNoTournamentThisWeek(true);
          return;
        }

        setTournament(weeklyTournament);

        // Step 3: Try to fetch field (may 404 if not available yet)
        try {
          const fieldRes = await pgaPoolApi.pgaTournaments.getField({
            pgaTournamentId: weeklyTournament.id,
          });

          // Sort players alphabetically within tiers
          Object.keys(fieldRes.data.player_tiers).forEach((tier) => {
            fieldRes.data.player_tiers[tier].sort(
              (
                a: PgaTournamentFieldPlayerTiersValueInner,
                b: PgaTournamentFieldPlayerTiersValueInner
              ) => (a.name <= b.name ? -1 : 1)
            );
          });

          setField(fieldRes.data);
        } catch (fieldError) {
          // Field not available is OK - we'll show fallback with tournament info
          if (!pgaPoolApi.is404Error(fieldError)) {
            throw fieldError;
          }
        }
      } catch (e) {
        setFetchError(e as Error);
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
  if (tournament && !field) {
    return (
      <PageContent>
        <Box height="medium" round="small" align="center" justify="center">
          <CircleQuestion size="large" />
          <Text size="large" textAlign="center" margin="small">
            {`The player field is not yet available for the ${tournament.date.year} ${tournament.name}`}
          </Text>
          <Text size="medium" textAlign="center" color="text-weak">
            {tournament.date.display}
          </Text>
          <Text size="medium" textAlign="center" color="text-weak" margin={{ top: 'small' }}>
            Check back soon for the tournament field
          </Text>
        </Box>
      </PageContent>
    );
  }

  // Tournament and field both exist
  if (field) {
    return <TournamentFieldDisplay field={field} />;
  }

  // Fallback (should not reach here)
  return null;
}
