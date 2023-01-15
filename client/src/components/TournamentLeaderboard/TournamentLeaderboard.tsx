import { Accordion, AccordionPanel, Box, PageContent, PageHeader, Text } from 'grommet';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';

import { PoolTournament } from '@drewkimberly/pga-pool-api';

export function TournamentLeaderboard() {
  const [tournament, setTournament] = React.useState<PoolTournament | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    async function fetchPoolTournaments() {
      setIsLoading(true);
      setFetchError(undefined);

      try {
        const tourneys = await pgaPoolApi.poolTournaments.getPoolTournaments();
        setTournament(tourneys.data.data[0]);
      } catch (e) {
        console.error(e);
        setFetchError(e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPoolTournaments();
  }, []);

  return (
    <PageContent>
      {fetchError && <div>{`Error: ${fetchError}`}</div>}
      {!isLoading && !tournament && <div>{`No tournament found`}</div>}
      {!fetchError && (
        <>
          <PageHeader title={tournament?.pga_tournament.name} size={'small'} skeleton={isLoading} />
          <Accordion skeleton={isLoading}>
            {tournament?.pool_users.map((user) => (
              <AccordionPanel key={user.id} label={`${user.user.nickname} ${user.score}`}>
                {user.picks.map((pick) => (
                  <Box key={pick.id} pad="small">
                    <Text>
                      {`${pick.pga_player.name}`} <Text weight={'bold'}>{pick.score_total}</Text>
                    </Text>
                  </Box>
                ))}
              </AccordionPanel>
            ))}
          </Accordion>
        </>
      )}
    </PageContent>
  );
}
