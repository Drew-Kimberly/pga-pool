import { Text, TextExtendedProps } from 'grommet';
import { CSSProperties } from 'react';

import {
  PgaTournamentPlayer,
  PgaTournamentPlayerStatusEnum as PlayerStatus,
} from '@drewkimberly/pga-pool-api';

export interface PgaPlayerProps extends TextExtendedProps {
  player: PgaTournamentPlayer;
}

export function PgaPlayerName({ player, ...textProps }: PgaPlayerProps) {
  const status = { [PlayerStatus.Cut]: 'C', [PlayerStatus.Wd]: 'WD' }?.[player.status as string];
  const style: CSSProperties =
    player.status === PlayerStatus.Active ? {} : { textDecoration: 'line-through' };

  return (
    <Text {...textProps}>
      <Text margin={status ? { right: 'xxsmall' } : { right: 'xsmall' }} style={style}>
        {player.pga_player.name}
      </Text>
      {status && (
        <Text size="xsmall" margin={{ right: 'xsmall' }} color="#FF003F">
          {status}
        </Text>
      )}
    </Text>
  );
}
