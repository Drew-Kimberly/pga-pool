import { PageHeader, Text } from 'grommet';

import { PgaTournament } from '@drewkimberly/pga-pool-api';

export interface TournamentHeaderProps {
  tournament: PgaTournament;
  round?: number;
}

export function TournamentHeader({ tournament, round }: TournamentHeaderProps) {
  const headerText =
    typeof round === 'number'
      ? `${tournament.date.year} ${tournament.name} - Round ${round}`
      : `${tournament.date.year} ${tournament.name}`;

  return (
    <>
      <PageHeader title={headerText} size={'small'} />
      <Text size="medium" style={{ fontStyle: 'italic' }}>
        {tournament.date.display}
      </Text>
    </>
  );
}
