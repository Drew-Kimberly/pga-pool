/* eslint-disable no-unreachable */
import { Accordion, Box, Notification, PageContent, ResponsiveContext, Text } from 'grommet';
import { CircleInformation } from 'grommet-icons';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { useInterval, usePersistedState } from '../../hooks';
import { Spinner } from '../Spinner';
import { Toggle } from '../Toggle';
import { TournamentHeader } from '../TournamentHeader';

import { PgaPlayerName } from './PgaPlayerName';
import { PoolUserPanel } from './PoolUserPanel';
import { RankType } from './types';
import { getEffectiveFedexCupPoints, toFedexCupPointsString, toScoreString } from './utils';

import { PoolTournament } from '@drewkimberly/pga-pool-api';

const POLL_INTERVAL = 60 * 1000; // 1 min

export function TournamentLeaderboard() {
  const [tournament, setTournament] = React.useState<PoolTournament | undefined>(undefined);
  const [rankType, setRankType] = usePersistedState<RankType>('score', `rank-type-selection`);
  const [isLoading, setIsLoading] = React.useState(true);
  const [initialFetchError, setInitialFetchError] = React.useState<Error | undefined>(undefined);
  const [pollErrorCount, setPollErrorCount] = React.useState(0);
  const size = React.useContext(ResponsiveContext);

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

  React.useMemo(() => {
    tournament?.pool_users.sort((a, b) => {
      if (rankType === 'score') {
        return a.score - b.score;
      } else if (rankType === 'fedex_cup_points') {
        const aPoints = getEffectiveFedexCupPoints(a) ?? 0;
        const bPoints = getEffectiveFedexCupPoints(b) ?? 0;
        return bPoints - aPoints;
      } else {
        throw new Error(`Unsupported leaderboard rank type: ${rankType}`);
      }
    });
  }, [rankType, tournament]);

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
            <Notification status="critical" message="Error refreshing tournament scores" />
          )}

          <Box
            fill="horizontal"
            align={size === 'small' ? 'start' : 'end'}
            pad={size === 'small' ? { top: 'large', bottom: 'medium' } : undefined}
          >
            <Toggle
              label={
                <Text size="small">{size !== 'small' ? 'FedEx Cup Points' : 'FedEx Points'}</Text>
              }
              checked={rankType === 'fedex_cup_points'}
              onChange={(event) => setRankType(event.target.checked ? 'fedex_cup_points' : 'score')}
            />
          </Box>

          <Accordion margin={{ bottom: 'medium', top: 'medium' }}>
            {tournament?.pool_users.map((user) => (
              <PoolUserPanel
                key={user.id}
                user={user}
                pgaTournament={tournament.pga_tournament}
                tournamentRound={round ?? undefined}
                rankType={rankType}
              >
                {user.picks.map((pick) => (
                  <Box key={pick.id} pad="small" direction="row">
                    <PgaPlayerName player={pick} />
                    <Text weight={'bold'}>
                      {rankType === 'score'
                        ? toScoreString(pick.score_total)
                        : toFedexCupPointsString(getEffectiveFedexCupPoints(pick))}
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
