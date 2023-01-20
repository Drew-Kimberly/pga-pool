import { AccordionPanel, Box, Meter, ResponsiveContext, Text, Tip } from 'grommet';
import { FormCheckmark } from 'grommet-icons';
import { useContext } from 'react';

import { ParentComponentProps } from '../../types';
import { toScoreString } from '../utils';

import { getRoundStatus } from './getRoundStatus';

import { PoolUser } from '@drewkimberly/pga-pool-api';

export interface PoolUserPanelProps extends ParentComponentProps {
  user: PoolUser;
  tournamentRound?: number;
}

/**
 * - Round Status:
 *     - N players active (with % complete)
 *     - No players active
 *     - Round Complete
 * - Score trends
 */
function _PoolUserPanel({ user }: Omit<PoolUserPanelProps, 'children'>) {
  const size = useContext(ResponsiveContext);
  const roundStatus = getRoundStatus(user.picks);
  const playersActive = user.picks.filter(
    (p) => !p.is_round_complete && p.score_thru !== null
  ).length;

  return (
    <Box direction="row" height="100%">
      <Box pad="small" alignSelf="center" fill="horizontal">
        <Text weight="bold" size="medium">
          {user.user.nickname}
        </Text>
      </Box>
      {roundStatus === 'not_started' && (
        <Box direction="row" fill="horizontal" align="center" pad={{ left: 'small' }}>
          <Text size="small">Not Started</Text>
        </Box>
      )}
      {roundStatus === 'complete' && (
        <Box direction="row" fill="horizontal" align="center" pad={{ left: 'small' }}>
          <Text size="small">Round Complete</Text>
          <FormCheckmark color="#32de84" />
        </Box>
      )}
      {typeof roundStatus === 'number' && (
        <Box fill="horizontal">
          <Box pad={{ left: 'small', top: 'small', bottom: 'xsmall' }} direction="row">
            <Text size="small">{size === 'small' ? 'Progress:' : 'Round Progress:'}</Text>
            <Tip
              plain={true}
              dropProps={{ align: { bottom: 'top', left: 'left' } }}
              content={
                <Box
                  pad="xxsmall"
                  elevation="small"
                  background="#EDEDED" // no opacity
                  round="xsmall"
                  margin="xsmall"
                  overflow="hidden"
                >
                  <Text size="small">{`${roundStatus}% complete`}</Text>
                </Box>
              }
            >
              <Meter
                type="bar"
                background="light-2"
                values={[{ value: roundStatus as number }]}
                size="xxsmall"
                thickness="xsmall"
                alignSelf="center"
                margin={{ left: 'small' }}
              />
            </Tip>
          </Box>
          <Box pad={{ bottom: 'small', left: 'small' }} direction="row">
            <Text size="small">{size === 'small' ? 'Players:' : 'Players Active:'}</Text>
            <Text
              size="small"
              margin={{ left: 'small' }}
              style={{ minWidth: 'fit-content' }}
            >{`${playersActive} of ${user.picks.length}`}</Text>
          </Box>
        </Box>
      )}
      <Box pad="small" alignSelf="center" fill="horizontal">
        <Text weight="bold" size="xlarge" alignSelf="end">{`${toScoreString(user.score)}`}</Text>
      </Box>
    </Box>
  );
}

export function PoolUserPanel({ user, children }: PoolUserPanelProps) {
  return <AccordionPanel header={<_PoolUserPanel user={user} />}>{children}</AccordionPanel>;
}
