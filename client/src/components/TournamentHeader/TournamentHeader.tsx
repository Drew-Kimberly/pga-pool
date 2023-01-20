import { PageHeader, Text } from 'grommet';

import { PgaTournament } from '@drewkimberly/pga-pool-api';

function toFriendlyDate(date: string): string {
  const d = new Date(date).toDateString().split(' ');
  return `${d[1]} ${d[2]}, ${d[3]}`;
}

export interface TournamentHeaderProps {
  tournament: PgaTournament;
  round?: number;
}

export function TournamentHeader({ tournament, round }: TournamentHeaderProps) {
  const headerText =
    typeof round === 'number' ? `${tournament.name} - Round ${round}` : tournament.name;

  return (
    <>
      <PageHeader title={headerText} size={'small'} />
      <Text size="medium" style={{ fontStyle: 'italic' }}>{`${toFriendlyDate(
        tournament.date.start
      )} - ${toFriendlyDate(tournament.date.end)}`}</Text>
    </>
  );
}
