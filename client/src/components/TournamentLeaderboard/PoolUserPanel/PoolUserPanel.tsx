import { AccordionPanel, Box, Text } from 'grommet';
import { FormCheckmark, FormDown } from 'grommet-icons';

import { ParentComponentProps } from '../../types';
import { PlayerHeadshot } from '../PlayerHeadshot';
import { getScoreColor, isCutOrWithdrawn, toFedexCupPointsString, toScoreString } from '../utils';

import { getRoundStatus } from './getRoundStatus';
import { StartDuration } from './StartDuration';

import { PgaTournament, PoolTournamentUser } from '@drewkimberly/pga-pool-api';

export interface PoolUserPanelProps extends ParentComponentProps {
  user: PoolTournamentUser;
  pgaTournament: PgaTournament;
  scoringFormat: string;
  isOpen?: boolean;
  rank: string;
}

function _PoolUserPanel({
  user,
  pgaTournament,
  scoringFormat,
  isOpen,
  rank,
}: Omit<PoolUserPanelProps, 'children'>) {
  const roundStatus = getRoundStatus(
    user.picks.map((pick) => pick.pga_tournament_player),
    pgaTournament
  );

  const isStrokes = scoringFormat === 'strokes';
  const scoreDisplay = isStrokes
    ? toScoreString(user.score)
    : `${toFedexCupPointsString(user.fedex_cup_points)} pts`;
  const scoreColor = isStrokes ? getScoreColor(user.score) : undefined;

  return (
    <Box pad={{ vertical: 'small', horizontal: 'small' }}>
      {/* Line 1: Rank + Nickname + Round Status + Score + Chevron */}
      <Box direction="row" align="center" gap="small">
        <Box
          width="28px"
          height="28px"
          round="full"
          background="rank-badge"
          align="center"
          justify="center"
          flex={false}
        >
          <Text size="xsmall" color="white" weight="bold">
            {rank}
          </Text>
        </Box>

        <Text weight="bold" size="medium" style={{ flex: 1, minWidth: 0 }} truncate>
          {user.user.nickname}
        </Text>

        {/* Compact round status */}
        <Box flex={false}>
          {roundStatus.status === 'not_started' && (
            <StartDuration time={roundStatus.teetimes[0] ?? null} size="xsmall" color="text-weak" />
          )}
          {roundStatus.status === 'in_progress' && (
            <Text size="xsmall" color="text-weak">
              {roundStatus.percentComplete}%
            </Text>
          )}
          {roundStatus.status === 'complete' && (
            <Box direction="row" align="center" gap="xxsmall">
              <Text size="xsmall" color="text-weak">
                Complete
              </Text>
              <FormCheckmark color="var(--color-status-live)" size="small" />
            </Box>
          )}
        </Box>

        <Text
          weight="bold"
          size="xlarge"
          color={scoreColor}
          style={{
            fontFamily: 'var(--font-display)',
            minWidth: 'fit-content',
          }}
        >
          {scoreDisplay}
        </Text>

        <Box
          flex={false}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <FormDown size="medium" color="text-weak" />
        </Box>
      </Box>

      {/* Line 2: Headshot chips */}
      <Box direction="row" gap="xsmall" margin={{ top: 'xsmall', left: '36px' }}>
        {user.picks.map((pick) => {
          const player = pick.pga_tournament_player;
          const isCut = isCutOrWithdrawn(player);
          const chipScoreColor = isStrokes ? getScoreColor(player.score_total) : undefined;

          return (
            <Box key={player.id} style={{ opacity: isCut ? 0.5 : 1 }}>
              <PlayerHeadshot
                src={player.pga_player.headshot_url}
                name={player.pga_player.name}
                size={24}
                borderColor={chipScoreColor}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export function PoolUserPanel({ children, ...rest }: PoolUserPanelProps) {
  return <AccordionPanel header={<_PoolUserPanel {...rest} />}>{children}</AccordionPanel>;
}
