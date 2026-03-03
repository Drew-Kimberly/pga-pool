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
      <Box direction="row" gap={isDesktop ? 'medium' : 'small'}>
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
            style={{ flexShrink: 0, alignSelf: 'center' }}
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

        <Box flex gap="xsmall">
          {/* Name row with status badge pinned right */}
          <Box direction="row" justify="between" align="start" gap="small">
            <Text
              size={isDesktop ? 'xlarge' : 'large'}
              weight="bold"
              style={{ fontFamily: 'var(--font-display)', lineHeight: 1.2 }}
            >
              {tournament.name}
            </Text>

            {isDesktop && (
              <Box flex={false} style={{ marginTop: '2px' }}>
                <StatusBadge tournament={tournament} round={round} />
              </Box>
            )}
          </Box>

          <Box gap="xxsmall">
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

          {/* Meta pills + mobile status badge */}
          <Box direction="row" align="center" gap="xsmall" wrap>
            {!isDesktop && <StatusBadge tournament={tournament} round={round} />}
            {tournament.par != null && <MetaPill label={`Par ${tournament.par}`} />}
            {tournament.yardage != null && (
              <MetaPill label={`${tournament.yardage.toLocaleString()} yds`} />
            )}
            <MetaPill label={formatPurse(tournament.purse)} />
          </Box>
        </Box>
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

interface StatusBadgeProps {
  tournament: PgaTournament;
  round?: number;
}

function StatusBadge({ tournament, round }: StatusBadgeProps) {
  const status = resolveStatus(tournament, round);

  return (
    <Box
      direction="row"
      align="center"
      gap="xsmall"
      pad={{ horizontal: 'small', vertical: 'xxsmall' }}
      round="small"
      flex={false}
      style={{
        backgroundColor: status.bg,
        borderColor: status.color,
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      {status.dot && <PulsingDot />}
      <Text size="xsmall" weight="bold" style={{ color: status.color }}>
        {status.label.toUpperCase()}
      </Text>
    </Box>
  );
}

interface ResolvedStatus {
  label: string;
  color: string;
  bg: string;
  dot?: boolean;
}

function resolveStatus(tournament: PgaTournament, round?: number): ResolvedStatus {
  const { tournament_status, round_status, current_round } = tournament;
  const displayRound = round ?? current_round;

  if (tournament_status === PgaTournamentTournamentStatusEnum.InProgress) {
    const isRoundActive = round_status === PgaTournamentRoundStatusEnum.InProgress;
    const roundLabel = displayRound ? `Round ${displayRound}` : '';
    const suffix = isRoundActive ? 'Live' : 'Suspended';

    return {
      label: [roundLabel, suffix].filter(Boolean).join(' \u00B7 '),
      color: 'var(--color-status-live)',
      bg: 'rgba(34, 197, 94, 0.12)',
      dot: isRoundActive,
    };
  }

  if (tournament_status === PgaTournamentTournamentStatusEnum.Completed) {
    return {
      label: 'Official',
      color: 'var(--color-status-complete)',
      bg: 'rgba(107, 114, 128, 0.10)',
    };
  }

  return {
    label: 'This Week',
    color: 'var(--color-status-not-started)',
    bg: 'rgba(156, 163, 175, 0.10)',
  };
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
