import { AccordionPanel, Box, Meter, ResponsiveContext, Text, Tip } from 'grommet';
import { FormCheckmark } from 'grommet-icons';
import { useContext } from 'react';

import { ParentComponentProps } from '../../types';
import { RankType } from '../types';
import { getEffectiveFedexCupPoints, toFedexCupPointsString, toScoreString } from '../utils';

import { getRoundStatus } from './getRoundStatus';
import { StartDuration } from './StartDuration';

import { PgaTournament, PoolUser } from '@drewkimberly/pga-pool-api';

export interface PoolUserPanelProps extends ParentComponentProps {
  user: PoolUser;
  pgaTournament: PgaTournament;
  tournamentRound?: number;
  rankType: RankType;
}

/**
 * @TODO
 * - Score trends
 */
function _PoolUserPanel({ user, pgaTournament, rankType }: Omit<PoolUserPanelProps, 'children'>) {
  const size = useContext(ResponsiveContext);
  const roundStatus = getRoundStatus(user.picks, pgaTournament);

  return (
    <Box direction="row" height="100%">
      <Box pad="small" alignSelf="center" fill="horizontal">
        <Text weight="bold" size="medium">
          {user.user.nickname}
        </Text>
      </Box>
      {roundStatus.status === 'not_started' && (
        <Box direction="row" fill="horizontal" align="center" pad={{ left: 'small' }}>
          <StartDuration time={roundStatus.teetimes[0]} size="small" />
        </Box>
      )}
      {roundStatus.status === 'complete' && (
        <Box direction="row" fill="horizontal" align="center" pad={{ left: 'small' }}>
          <Text size="small">Round Complete</Text>
          <FormCheckmark color="#32de84" />
        </Box>
      )}
      {roundStatus.status === 'in_progress' && (
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
                  <Text size="small">{`${roundStatus.percentComplete}% complete`}</Text>
                </Box>
              }
            >
              <Meter
                type="bar"
                background="light-2"
                values={[{ value: roundStatus.percentComplete }]}
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
            >{`${roundStatus.playersActive.length} of ${user.picks.length}`}</Text>
          </Box>
        </Box>
      )}
      <Box pad="small" alignSelf="center" fill="horizontal">
        <Text weight="bold" size="xlarge" alignSelf="end">{`${
          rankType === 'score'
            ? toScoreString(user.score)
            : toFedexCupPointsString(getEffectiveFedexCupPoints(user))
        }`}</Text>
      </Box>
    </Box>
  );
}

export function PoolUserPanel({ children, ...rest }: PoolUserPanelProps) {
  return <AccordionPanel header={<_PoolUserPanel {...rest} />}>{children}</AccordionPanel>;
}
