import { Box, Text } from 'grommet';

import { RankedPoolUser } from './types';

export interface PoolStandingsRowProps {
  user: RankedPoolUser;
  rankLabel: string;
  scoreLabel: string;
}

export function PoolStandingsRow(props: PoolStandingsRowProps) {
  const { user, rankLabel, scoreLabel } = props;
  const displayName = user.user.nickname || user.user.name;
  const showFullName = !!user.user.nickname && user.user.nickname !== user.user.name;

  return (
    <Box
      direction="row"
      justify="between"
      align="center"
      pad={{ horizontal: 'small', vertical: 'small' }}
      round="small"
      border={{ size: 'xsmall', color: 'border' }}
      background="background-front"
      gap="small"
    >
      <Box direction="row" align="center" gap="small" flex>
        <Box
          width="40px"
          height="40px"
          round="full"
          background="brand"
          align="center"
          justify="center"
          flex={false}
        >
          <Text size="small" color="white" weight="bold">
            {rankLabel}
          </Text>
        </Box>
        <Box>
          <Text size="medium" weight="bold">
            {displayName}
          </Text>
          {showFullName && (
            <Text size="xsmall" color="text-weak">
              {user.user.name}
            </Text>
          )}
        </Box>
      </Box>
      <Box align="end" flex={false}>
        <Text size="large" weight="bold">
          {scoreLabel}
        </Text>
      </Box>
    </Box>
  );
}
