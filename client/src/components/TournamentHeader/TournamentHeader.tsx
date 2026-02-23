import { Box, Text } from 'grommet';

import { PgaTournament } from '@drewkimberly/pga-pool-api';

export interface TournamentHeaderProps {
  tournament: PgaTournament;
  round?: number;
}

export function TournamentHeader({ tournament, round }: TournamentHeaderProps) {
  const roundText = typeof round === 'number' ? `Round ${round}` : null;

  return (
    <Box gap="xsmall" pad={{ vertical: 'small' }}>
      <Box direction="row" align="center" gap="medium">
        {tournament.logo_url && (
          <Box
            flex={false}
            width="130px"
            height="130px"
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
                width: '110px',
                height: '110px',
                objectFit: 'contain',
              }}
            />
          </Box>
        )}
        <Box gap="xxsmall">
          <Text size="large" weight="bold">
            {tournament.name}
          </Text>
          {roundText && (
            <Text size="medium" weight="bold" color="text-weak">
              {roundText}
            </Text>
          )}
          <Text size="small" style={{ fontStyle: 'italic' }} color="text-weak">
            {tournament.date.display}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
