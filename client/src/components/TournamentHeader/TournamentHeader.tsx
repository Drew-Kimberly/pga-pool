import { Box, ResponsiveContext, Text } from 'grommet';
import React from 'react';

import {
  PgaTournament,
  PgaTournamentRoundStatusEnum,
  PgaTournamentTournamentStatusEnum,
} from '@drewkimberly/pga-pool-api';

export interface TournamentHeaderProps {
  tournament: PgaTournament;
  round?: number;
}

export function TournamentHeader({ tournament, round }: TournamentHeaderProps) {
  const size = React.useContext(ResponsiveContext);
  const isDesktop = size !== 'small';
  const circleSize = isDesktop ? '100px' : '80px';
  const imgSize = isDesktop ? '90px' : '68px';

  return (
    <Box gap="small" pad={{ vertical: 'small' }}>
      <Box direction="row" align="center" gap={isDesktop ? 'medium' : 'small'}>
        {tournament.logo_url && (
          <Box
            flex={false}
            width={circleSize}
            height={circleSize}
            round="full"
            overflow="hidden"
            border={{ size: 'xsmall', color: 'light-4' }}
            background="white"
            align="center"
            justify="center"
            style={{ flexShrink: 0 }}
          >
            <img
              src={tournament.logo_url}
              alt=""
              style={{
                width: imgSize,
                height: imgSize,
                objectFit: 'contain',
              }}
            />
          </Box>
        )}

        <Box gap="xxsmall" flex>
          <Text
            size={isDesktop ? 'xlarge' : 'large'}
            weight="bold"
            style={{ fontFamily: 'var(--font-display)', lineHeight: 1.2 }}
          >
            {tournament.name}
          </Text>

          <Text size="small" color="text-weak">
            {tournament.course_name}
            {tournament.city && tournament.state
              ? ` \u00B7 ${tournament.city}, ${tournament.state}`
              : ''}
          </Text>

          <Text size="small" style={{ fontStyle: 'italic' }} color="text-weak">
            {tournament.date.display}
          </Text>
        </Box>
      </Box>

      <Box direction="row" align="center" gap="small" wrap>
        <StatusIndicator tournament={tournament} round={round} />

        {tournament.par != null && <MetaPill label={`Par ${tournament.par}`} />}
        {tournament.yardage != null && (
          <MetaPill label={`${tournament.yardage.toLocaleString()} yds`} />
        )}
        <MetaPill label={formatPurse(tournament.purse)} />
      </Box>
    </Box>
  );
}

interface MetaPillProps {
  label: string;
}

function MetaPill({ label }: MetaPillProps) {
  return (
    <Box
      pad={{ horizontal: 'small', vertical: 'xxsmall' }}
      round="small"
      border={{ size: 'xsmall', color: 'border' }}
      background="background-front"
      flex={false}
    >
      <Text size="xsmall" weight="bold">
        {label}
      </Text>
    </Box>
  );
}

interface StatusIndicatorProps {
  tournament: PgaTournament;
  round?: number;
}

function StatusIndicator({ tournament, round }: StatusIndicatorProps) {
  const { tournament_status, round_status, current_round } = tournament;
  const displayRound = round ?? current_round;

  if (tournament_status === PgaTournamentTournamentStatusEnum.InProgress) {
    const isRoundActive = round_status === PgaTournamentRoundStatusEnum.InProgress;
    const roundLabel = displayRound ? `Round ${displayRound}` : '';
    const label = isRoundActive
      ? [roundLabel, 'Live'].filter(Boolean).join(' \u00B7 ')
      : [roundLabel, 'Suspended'].filter(Boolean).join(' \u00B7 ');

    return (
      <StatusBadge
        label={label}
        color="var(--color-status-live)"
        bg="rgba(34, 197, 94, 0.12)"
        dot
      />
    );
  }

  if (tournament_status === PgaTournamentTournamentStatusEnum.Completed) {
    return (
      <StatusBadge
        label="Complete"
        color="var(--color-status-complete)"
        bg="rgba(107, 114, 128, 0.10)"
      />
    );
  }

  return (
    <StatusBadge
      label="Upcoming"
      color="var(--color-status-not-started)"
      bg="rgba(156, 163, 175, 0.10)"
    />
  );
}

interface StatusBadgeProps {
  label: string;
  color: string;
  bg: string;
  dot?: boolean;
}

function StatusBadge({ label, color, bg, dot }: StatusBadgeProps) {
  return (
    <Box
      direction="row"
      align="center"
      gap="xsmall"
      pad={{ horizontal: 'small', vertical: 'xxsmall' }}
      round="small"
      flex={false}
      style={{ backgroundColor: bg, borderColor: color, borderWidth: '1px', borderStyle: 'solid' }}
    >
      {dot && <PulsingDot />}
      <Text size="xsmall" weight="bold" style={{ color }}>
        {label.toUpperCase()}
      </Text>
    </Box>
  );
}

function PulsingDot() {
  return (
    <Box
      flex={false}
      width="8px"
      height="8px"
      round="full"
      style={{
        backgroundColor: 'var(--color-status-live)',
        animation: 'pulse-live 2s ease-in-out infinite',
      }}
    />
  );
}

function formatPurse(purse: number): string {
  if (purse >= 1_000_000) {
    const millions = purse / 1_000_000;
    const formatted = millions % 1 === 0 ? `${millions}` : `${parseFloat(millions.toFixed(1))}`;
    return `$${formatted}M`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(purse);
}
