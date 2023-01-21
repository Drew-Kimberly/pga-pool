/* eslint-disable no-unreachable */
import { Accordion, Box, Notification, PageContent, Text } from 'grommet';
import { CircleInformation } from 'grommet-icons';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { useInterval } from '../../hooks';
import { Spinner } from '../Spinner';
import { TournamentHeader } from '../TournamentHeader';

import { PoolUserPanel } from './PoolUserPanel';

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
        const tourneys = await pgaPoolApi.poolTournaments.getCurrent();
        setTournament(tourneys.data);
      } catch (e) {
        if (!pgaPoolApi.is404Error(e)) {
          console.error(e);
          setInitialFetchError(e);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchPoolTournaments();
  }, []);

  useInterval(async () => {
    try {
      const tourneys = await pgaPoolApi.poolTournaments.getCurrent();
      setPollErrorCount(0);
      setTournament(tourneys.data);
    } catch (e) {
      if (!pgaPoolApi.is404Error(e)) {
        console.error(e);
        setPollErrorCount((prev) => prev + 1);
      }
    }
  }, POLL_INTERVAL);

  const round = tournament?.pool_users[0]?.picks[0].current_round ?? undefined;

  return (
    <PageContent>
      {isLoading && <Spinner />}
      {!isLoading && initialFetchError && <div>{`Error: ${initialFetchError}`}</div>}
      {!isLoading && !initialFetchError && !tournament && (
        <Box height="medium" round="small" align="center" justify="center">
          <CircleInformation size="large" />
          <Text size="large" textAlign="center" margin="small">
            No PGA Tournament event is currently active! <br /> Please check back later
          </Text>
        </Box>
      )}
      {!isLoading && !initialFetchError && tournament && (
        <>
          <TournamentHeader tournament={tournament.pga_tournament} round={round} />

          {pollErrorCount >= 2 && (
            <Notification status="critical" message="Error refreshing tournamnet scores" />
          )}

          <Accordion margin={{ bottom: 'medium', top: 'medium' }}>
            {tournament?.pool_users.map((user) => (
              <PoolUserPanel
                key={user.id}
                user={user}
                pgaTournament={tournament.pga_tournament}
                tournamentRound={round ?? undefined}
              >
                {user.picks.map((pick) => (
                  <Box key={pick.id} pad="small">
                    <Text>
                      {`${pick.pga_player.name}`} <Text weight={'bold'}>{pick.score_total}</Text>
                    </Text>
                  </Box>
                ))}
              </PoolUserPanel>
            ))}
          </Accordion>
        </>
      )}
    </PageContent>
  );
}
