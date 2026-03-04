import { Accordion, Anchor, Box, Notification, Text } from 'grommet';
import { CircleInformation } from 'grommet-icons';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool';
import { useInterval } from '../../hooks';
import { Spinner } from '../Spinner';
import { useTournamentLayoutContext } from '../TournamentLayout/TournamentLayout';

import { PgaPlayerName } from './PgaPlayerName';
import { PlayerHeadshot } from './PlayerHeadshot';
import { PoolUserPanel } from './PoolUserPanel';
import {
  buildScoreMeta,
  getEffectiveFedexCupPoints,
  getScoreColor,
  isCutOrWithdrawn,
  MetaPair,
  toFedexCupPointsString,
  toScoreString,
} from './utils';

import { PoolTournamentUser } from '@drewkimberly/pga-pool-api';

const USERS_POLL_INTERVAL = 30 * 1000; // 30s

function MetaLabel({ pair }: { pair: MetaPair }) {
  return (
    <Box direction="row" align="baseline" gap="xxsmall">
      <Text
        size="xsmall"
        color="text-weak"
        style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
      >
        {pair.label}
      </Text>
      <Text size="xsmall" weight="bold" color={pair.color}>
        {pair.value}
      </Text>
    </Box>
  );
}

export function TournamentLeaderboard() {
  const { tournament, poolId } = useTournamentLayoutContext();
  const [poolUsers, setPoolUsers] = React.useState<PoolTournamentUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [initialFetchError, setInitialFetchError] = React.useState<Error | undefined>(undefined);
  const [pollErrorCount, setPollErrorCount] = React.useState(0);
  const [activeIndices, setActiveIndices] = React.useState<number[]>([]);

  const scoringFormat = tournament.pool?.settings?.scoring_format ?? 'strokes';
  const isStrokesPool = scoringFormat === 'strokes';
  const timezone = tournament.pga_tournament.date.timezone;

  React.useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      setInitialFetchError(undefined);
      setPollErrorCount(0);

      try {
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
  }, [poolId, tournament.id]);

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
            scoringFormat={scoringFormat}
            isOpen={activeIndices.includes(index)}
          >
            <Box
              background="background-contrast"
              border={{ side: 'bottom', color: 'border', size: 'small' }}
            >
              {user.picks.map((pick, pickIndex) => {
                const player = pick.pga_tournament_player;
                const isCut = isCutOrWithdrawn(player);

                const poolScore = isStrokesPool
                  ? toScoreString(player.score_total)
                  : toFedexCupPointsString(
                      getEffectiveFedexCupPoints(tournament.pga_tournament, player)
                    );
                const poolScoreColor = isStrokesPool
                  ? getScoreColor(player.score_total)
                  : undefined;

                const odds = pick.odds ?? null;

                const scoreMeta = buildScoreMeta({
                  player,
                  timezone,
                  isStrokesPool,
                  isCutOrWithdrawn: isCut,
                });

                return (
                  <Box
                    key={player.id}
                    pad={{ vertical: 'small', horizontal: 'small' }}
                    style={{ opacity: isCut ? 0.5 : 1 }}
                    border={
                      pickIndex < user.picks.length - 1
                        ? { side: 'bottom', color: 'var(--color-tab-border)', size: '1px' }
                        : undefined
                    }
                  >
                    <Box direction="row" align="center" gap="small">
                      {/* Headshot */}
                      <PlayerHeadshot
                        src={player.pga_player.headshot_url}
                        name={player.pga_player.name}
                        size={40}
                      />

                      {/* Name + metadata column */}
                      <Box flex style={{ minWidth: 0 }}>
                        {/* Row 1: Name + odds chip */}
                        <Box direction="row" align="center" gap="xsmall">
                          <PgaPlayerName player={player} />
                          {odds && (
                            <Box
                              round="large"
                              pad={{ horizontal: 'xsmall', vertical: '1px' }}
                              flex={false}
                              style={{
                                backgroundColor: 'var(--color-status-upcoming-bg)',
                                border: '1px solid var(--color-tab-border)',
                              }}
                            >
                              <Text size="xsmall" weight="bold" style={{ lineHeight: 1.3 }}>
                                {odds}
                              </Text>
                            </Box>
                          )}
                        </Box>

                        {/* Row 2: Score metadata */}
                        {scoreMeta.length > 0 && (
                          <Box direction="row" gap="small" margin={{ top: 'xxsmall' }}>
                            {scoreMeta.map((pair) => (
                              <MetaLabel key={pair.label} pair={pair} />
                            ))}
                          </Box>
                        )}
                      </Box>

                      {/* Pool score — right aligned */}
                      <Text
                        weight="bold"
                        color={poolScoreColor}
                        style={{
                          minWidth: 'fit-content',
                          fontFamily: 'var(--font-display)',
                          fontSize: 'var(--text-lg)',
                        }}
                      >
                        {poolScore}
                      </Text>
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
