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
  const circleSize = isDesktop ? '116px' : '90px';
  const imgSize = isDesktop ? '110px' : '78px';
  const status = resolveStatus(tournament, round);

  const locationParts: string[] = [];
  if (tournament.course_name) locationParts.push(tournament.course_name);
  if (tournament.city && tournament.state) {
    locationParts.push(`${tournament.city}, ${tournament.state}`);
  }

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

        <Box flex gap="xsmall" justify="center">
          <Text
            size={isDesktop ? 'xlarge' : 'large'}
            weight="bold"
            style={{ fontFamily: 'var(--font-display)', lineHeight: 1.2 }}
          >
            {tournament.name}
          </Text>

          {/* Location line */}
          <Text size="small" color="text-weak">
            {locationParts.join(' \u00B7 ')}
          </Text>

          {/* Date + inline status */}
          <Box direction="row" align="center" gap="xsmall" wrap>
            <Text size="small" style={{ fontStyle: 'italic' }} color="text-weak">
              {tournament.date.display}
            </Text>
            {status && <InlineStatusBadge status={status} />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

interface ResolvedStatus {
  label: string;
  variant: 'live' | 'official' | 'upcoming' | 'pending';
  dot?: boolean;
}

function resolveStatus(tournament: PgaTournament, round?: number): ResolvedStatus | null {
  const { tournament_status, round_status, current_round } = tournament;
  const displayRound = round ?? current_round;

  if (tournament_status === PgaTournamentTournamentStatusEnum.InProgress) {
    const isRoundActive = round_status === PgaTournamentRoundStatusEnum.InProgress;
    const roundLabel = displayRound ? `Round ${displayRound}` : '';
    const suffix = isRoundActive ? 'Live' : 'Suspended';

    return {
      label: [roundLabel, suffix].filter(Boolean).join(' \u00B7 '),
      variant: 'live',
      dot: isRoundActive,
    };
  }

  if (tournament_status === PgaTournamentTournamentStatusEnum.Completed) {
    return { label: 'Official', variant: 'official' };
  }

  return null;
}

const BADGE_STYLES: Record<
  ResolvedStatus['variant'],
  { color: string; bg: string; textColor: string }
> = {
  live: {
    color: 'var(--color-status-live)',
    bg: 'var(--color-status-live-bg)',
    textColor: 'var(--color-status-live)',
  },
  official: {
    color: 'var(--color-status-official)',
    bg: 'var(--color-status-official-bg)',
    textColor: '#ffffff',
  },
  upcoming: {
    color: 'var(--color-status-upcoming)',
    bg: 'var(--color-status-upcoming-bg)',
    textColor: 'var(--color-status-upcoming)',
  },
  pending: {
    color: 'var(--color-status-pending)',
    bg: 'var(--color-status-pending-bg)',
    textColor: 'var(--color-status-pending)',
  },
};

interface InlineStatusBadgeProps {
  status: ResolvedStatus;
}

function InlineStatusBadge({ status }: InlineStatusBadgeProps) {
  const styles = BADGE_STYLES[status.variant];

  return (
    <Box
      direction="row"
      align="center"
      gap="xxsmall"
      pad={{ horizontal: 'xsmall', vertical: 'xxsmall' }}
      round="xsmall"
      flex={false}
      style={{
        backgroundColor: styles.bg,
        borderColor: styles.color,
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      {status.dot && <PulsingDot />}
      <Text
        size="xsmall"
        weight="bold"
        style={{ color: styles.textColor, letterSpacing: '0.04em', fontSize: '0.65rem' }}
      >
        {status.label.toUpperCase()}
      </Text>
    </Box>
  );
}

function PulsingDot() {
  return (
    <Box
      flex={false}
      width="6px"
      height="6px"
      round="full"
      style={{
        backgroundColor: 'var(--color-status-live)',
        animation: 'pulse-live 2s ease-in-out infinite',
      }}
    />
  );
}
