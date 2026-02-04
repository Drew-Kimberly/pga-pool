import { Text, TextExtendedProps } from 'grommet';
import { CSSProperties } from 'react';

import { PgaTournamentPlayer } from '@drewkimberly/pga-pool-api';

export interface PgaPlayerProps extends TextExtendedProps {
  player: PgaTournamentPlayer;
}

export function PgaPlayerName({ player, ...textProps }: PgaPlayerProps) {
  const isCut = player.current_position === 'CUT';
  const isWithdrawn = player.withdrawn;
  const status = isCut ? 'C' : isWithdrawn ? 'WD' : undefined;
  const style: CSSProperties = status ? { textDecoration: 'line-through' } : {};

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
