import { Anchor, Grid, Heading, PageContent, ResponsiveContext, Text } from 'grommet';
import { Copy } from 'grommet-icons';
import React, { useContext } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { TournamentHeader } from '../TournamentHeader';

import { PgaTournamentField } from '@drewkimberly/pga-pool-api';

export interface TournamentFieldDisplayProps {
  field: PgaTournamentField;
}

function playerTiersToCSV(playerTiers: PgaTournamentField['player_tiers']): string {
  let csv = '';
  for (const [tier, players] of Object.entries(playerTiers)) {
    const line = `tier_${tier},${players.map((p) => p.name).join(',')}`;
    csv += `${line}\n`;
  }

  return csv;
}

export function TournamentFieldDisplay({ field }: TournamentFieldDisplayProps) {
  const size = useContext(ResponsiveContext);

  return (
    <PageContent>
      <TournamentHeader tournament={field.pga_tournament} />

      {size !== 'small' && (
        <CopyToClipboard text={playerTiersToCSV(field.player_tiers)}>
          <Anchor
            label={
              <Text size="small" textAlign="center" style={{ float: 'right', marginRight: '5em' }}>
                <Copy size="small" style={{ paddingRight: '3px' }} />
                Copy to CSV
              </Text>
            }
          />
        </CopyToClipboard>
      )}

      {Object.entries(field.player_tiers).map(([tier, players]) => (
        <React.Fragment key={tier}>
          <Heading level="3">{`Tier ${tier === '0' ? '🐯' : tier}`}</Heading>
          <Grid
            columns={{ count: size !== 'small' ? 3 : 2, size: 'auto' }}
            margin={{ bottom: 'medium' }}
          >
            {players.map((player) => (
              <Text key={player.player_id} margin="xxsmall">
                {player.name}
              </Text>
            ))}
          </Grid>
        </React.Fragment>
      ))}
    </PageContent>
  );
}
