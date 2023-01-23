import { PageHeader, Text } from 'grommet';
import { DateTime } from 'luxon';

import { PgaTournament } from '@drewkimberly/pga-pool-api';

function toFriendlyDate(date: string, tz: string): string {
  const t = DateTime.fromFormat(`${date} ${tz}`, 'y-MM-dd z');
  return t.toLocal().toFormat('MMM d, y');
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
        tournament.date.start,
        tournament.date.timezone
      )} - ${toFriendlyDate(tournament.date.end, tournament.date.timezone)}`}</Text>
    </>
  );
}
