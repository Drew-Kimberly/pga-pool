import { Box, Text } from 'grommet';

import { Pool } from '@drewkimberly/pga-pool-api';

export interface PoolStandingsHeaderProps {
  pool: Pool;
  usersCount: number;
  lastOfficialTournamentName: string | null;
}

export function PoolStandingsHeader(props: PoolStandingsHeaderProps) {
  const { pool, usersCount, lastOfficialTournamentName } = props;

  return (
    <Box
      round="medium"
      pad={{ horizontal: 'medium', vertical: 'medium' }}
      elevation="small"
      style={{
        background:
          'linear-gradient(145deg, rgba(22,27,34,0.98) 0%, rgba(33,48,66,0.98) 55%, rgba(43,64,87,0.98) 100%)',
      }}
      gap="small"
    >
      <Text size="medium " color="light-4" style={{ letterSpacing: '0.08em' }}>
        OFFICIAL POOL STANDINGS
      </Text>
      <Box direction="row" wrap gap="xsmall">
        <MetaPill label={`${pool.year}`} />
        <MetaPill label={toScoringFormatLabel(pool.settings?.scoring_format)} />
        <MetaPill label={`${usersCount} ${usersCount === 1 ? 'Contestant' : 'Contestants'}`} />
      </Box>
      <Box margin={{ top: 'xsmall' }} gap="xxsmall">
        <Text size="xsmall" color="light-4">
          Standings as of
        </Text>
        <Text size="medium" weight="bold" color="white">
          {lastOfficialTournamentName ?? 'No PGA tournament has been finalized yet.'}
        </Text>
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
      border={{ size: 'xsmall', color: 'rgba(255, 255, 255, 0.2)' }}
      background="rgba(255, 255, 255, 0.08)"
    >
      <Text size="xsmall" color="light-1" weight="bold">
        {label}
      </Text>
    </Box>
  );
}

function toScoringFormatLabel(scoringFormat: string | undefined): string {
  if (scoringFormat === 'fedex_cup_points') {
    return 'FedEx Cup Points';
  }

  if (scoringFormat === 'strokes') {
    return 'Strokes';
  }

  return 'Scoring Format Unknown';
}
