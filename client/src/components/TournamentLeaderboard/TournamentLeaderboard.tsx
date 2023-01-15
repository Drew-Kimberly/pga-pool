/* eslint-disable no-unreachable */
import {
  Accordion,
  AccordionPanel,
  Box,
  Notification,
  PageContent,
  PageHeader,
  Spinner,
  Text,
} from 'grommet';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { useInterval } from '../../hooks';

import { PoolTournament } from '@drewkimberly/pga-pool-api';

const POLL_INTERVAL = 60 * 1000; // 1 min

export function TournamentLeaderboard() {
  const [tournament, setTournament] = React.useState<PoolTournament | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [initialFetchError, setInitialFetchError] = React.useState<Error | undefined>(undefined);
  const [pollErrorCount, setPollErrorCount] = React.useState(0);

  React.useEffect(() => {
    async function fetchPoolTournaments() {
      setIsLoading(true);
      setInitialFetchError(undefined);

      try {
        const tourneys = await pgaPoolApi.poolTournaments.getPoolTournaments();
        setTournament(tourneys.data.data[0]);
      } catch (e) {
        console.error(e);
        setInitialFetchError(e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPoolTournaments();
  }, []);

  useInterval(async () => {
    try {
      const tourneys = await pgaPoolApi.poolTournaments.getPoolTournaments();
      setPollErrorCount(0);
      if (tourneys.data.data[0]) {
        setTournament(tourneys.data.data[0]);
      }
    } catch (e) {
      console.error(e);
      setPollErrorCount((prev) => prev + 1);
    }
  }, POLL_INTERVAL);

  return (
    <PageContent>
      {isLoading && (
        <Box align="center" pad="xlarge" justify="center">
          <Spinner size="medium" />
        </Box>
      )}
      {initialFetchError && <div>{`Error: ${initialFetchError}`}</div>}
      {!isLoading && !tournament && <div>{`No tournament found`}</div>}
      {!isLoading && !initialFetchError && (
        <>
          <PageHeader title={tournament?.pga_tournament.name} size={'small'} />

          {pollErrorCount >= 2 && (
            <Notification status="critical" message="Error refreshing tournamnet scores" />
          )}

          <Accordion>
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
