import { Accordion, Anchor, Box, Notification, ResponsiveContext, Text } from 'grommet';
import { CircleInformation } from 'grommet-icons';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { LocalStorage } from '../../api/storage';
import { useInterval, usePersistedState } from '../../hooks';
import { Spinner } from '../Spinner';
import { Toggle } from '../Toggle';
import { useTournamentLayoutContext } from '../TournamentLayout/TournamentLayout';

import { PgaPlayerName } from './PgaPlayerName';
import { PoolUserPanel } from './PoolUserPanel';
import { RankType } from './types';
import {
  formatTeeTimeLocal,
  getEffectiveFedexCupPoints,
  toFedexCupPointsString,
  toScoreString,
} from './utils';

import { PoolTournamentUser } from '@drewkimberly/pga-pool-api';

const USERS_POLL_INTERVAL = 30 * 1000; // 30s

export function TournamentLeaderboard() {
  const { tournament, poolId } = useTournamentLayoutContext();
  const [poolUsers, setPoolUsers] = React.useState<PoolTournamentUser[]>([]);
  const [rankType, setRankType] = usePersistedState<RankType>('score', `rank-type-selection`);
  const [isLoading, setIsLoading] = React.useState(true);
  const [initialFetchError, setInitialFetchError] = React.useState<Error | undefined>(undefined);
  const [pollErrorCount, setPollErrorCount] = React.useState(0);
  const [activeIndices, setActiveIndices] = React.useState<number[]>([]);
  const size = React.useContext(ResponsiveContext);

  React.useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      setInitialFetchError(undefined);
      setPollErrorCount(0);

      try {
        const rankTypeStorage = new LocalStorage();
        const storedRankType = rankTypeStorage.get<RankType>('rank-type-selection');
        if (!storedRankType && tournament.pool?.settings?.scoring_format === 'fedex_cup_points') {
          setRankType('fedex_cup_points');
        }

        const usersResponse = await pgaPoolApi.poolTournamentUsers.listPoolTournamentUsers({
          poolId,
          poolTournamentId: tournament.id,
          page: { number: 1, size: 200 },
        });
        setPoolUsers(usersResponse.data.data);
      } catch (e) {
        if (!pgaPoolApi.is404Error(e)) {
          setInitialFetchError(e as Error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, [poolId, tournament.id, setRankType, tournament.pool?.settings?.scoring_format]);

  useInterval(async () => {
    try {
      const usersResponse = await pgaPoolApi.poolTournamentUsers.listPoolTournamentUsers({
        poolId,
        poolTournamentId: tournament.id,
        page: { number: 1, size: 200 },
      });
      setPollErrorCount(0);
      setPoolUsers(usersResponse.data.data);
    } catch (e) {
      if (!pgaPoolApi.is404Error(e)) {
        setPollErrorCount((prev) => prev + 1);
      }
    }
  }, USERS_POLL_INTERVAL);

  const round = poolUsers[0]?.picks[0]?.pga_tournament_player?.current_round ?? undefined;

  if (isLoading) {
    return <Spinner />;
  }

  if (initialFetchError) {
    return <div>{`Error: ${initialFetchError}`}</div>;
  }

  if (poolUsers.length === 0) {
    return (
      <Box height="medium" round="small" align="center" justify="center">
        <CircleInformation size="large" />
        <Text size="large" textAlign="center" margin="small">
          This tournament is not live yet. Picks have not been submitted.
        </Text>
        <Anchor href="/pga-tournaments/weekly-field" label="View the weekly field" />
      </Box>
    );
  }

  return (
    <>
      {pollErrorCount >= 2 && (
        <Notification status="critical" message="Error refreshing tournament scores" />
      )}

      <Box
        fill="horizontal"
        align={size === 'small' ? 'start' : 'end'}
        pad={size === 'small' ? { top: 'medium', bottom: 'small' } : undefined}
      >
        <Box
          pad={{ vertical: 'small', horizontal: 'small' }}
          style={{ minHeight: '44px' }}
          justify="center"
        >
          <Toggle
            label={
              <Text size="small">{size !== 'small' ? 'FedEx Cup Points' : 'FedEx Points'}</Text>
            }
            checked={rankType === 'fedex_cup_points'}
            onChange={(event) => setRankType(event.target.checked ? 'fedex_cup_points' : 'score')}
          />
        </Box>
      </Box>

      <Accordion
        margin={{ bottom: 'medium', top: 'medium' }}
        activeIndex={activeIndices}
        onActive={setActiveIndices}
      >
        {poolUsers.map((user, index) => (
          <PoolUserPanel
            key={user.id}
            rank={user.rank}
            user={user}
            pgaTournament={tournament.pga_tournament}
            tournamentRound={round ?? undefined}
            rankType={rankType}
            isOpen={activeIndices.includes(index)}
          >
            <Box
              background="background-contrast"
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              border={{ side: 'bottom', color: 'border', size: 'small' }}
            >
              {user.picks.map((pick) => {
                const player = pick.pga_tournament_player;
                const tournamentRound =
                  round ?? tournament.pga_tournament.current_round ?? player.current_round ?? 1;
                const isRoundOne = tournamentRound === 1;
                const isActive =
                  player.active ||
                  player.status === 'complete' ||
                  player.is_round_complete ||
                  (player.score_thru ?? 0) > 0;
                const isCutOrWithdrawn =
                  player.withdrawn ||
                  player.current_position === 'CUT' ||
                  player.status === 'cut' ||
                  player.status === 'wd';
                const shouldShowScore = !isRoundOne || isActive;
                const shouldShowTeeTime = !isActive && !isCutOrWithdrawn && !!player.tee_time;
                const teeTimeLabel =
                  shouldShowTeeTime && player.tee_time
                    ? formatTeeTimeLocal(player.tee_time, tournament.pga_tournament.date.timezone)
                    : null;

                return (
                  <Box key={player.id} pad="small" direction="row" align="center" gap="small">
                    <Box direction="column" gap="xxsmall" flex>
                      <Box direction="row" align="baseline" gap="xsmall" wrap>
                        <PgaPlayerName player={player} />
                        {shouldShowScore && (
                          <Text weight={'bold'}>
                            {rankType === 'score'
                              ? toScoreString(player.score_total)
                              : toFedexCupPointsString(
                                  getEffectiveFedexCupPoints(player.pga_tournament, player)
                                )}
                          </Text>
                        )}
                      </Box>
                      {teeTimeLabel && (
                        <Text size="xsmall" color="dark-4" weight="bold">
                          {`Tees off at ${teeTimeLabel}`}
                        </Text>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </PoolUserPanel>
        ))}
      </Accordion>
    </>
  );
}
