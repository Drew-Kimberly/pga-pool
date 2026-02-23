import { Box, ResponsiveContext, Text } from 'grommet';
import React from 'react';

import { PgaTournament } from '@drewkimberly/pga-pool-api';

export interface TournamentHeaderProps {
  tournament: PgaTournament;
  round?: number;
}

export function TournamentHeader({ tournament, round }: TournamentHeaderProps) {
  const size = React.useContext(ResponsiveContext);
  const isDesktop = size !== 'small';
  const roundText = typeof round === 'number' ? `Round ${round}` : null;
  const circleSize = isDesktop ? '116px' : '90px';
  const imgSize = isDesktop ? '110px' : '78px';

  return (
    <Box gap="xsmall" pad={{ vertical: 'small' }}>
      <Box direction="row" align="center" gap="medium">
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
