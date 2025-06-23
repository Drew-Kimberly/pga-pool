import { Box, Heading, Select, Text } from 'grommet';
import React, { useEffect } from 'react';

import { useAuth } from '../../hooks';

export const LeagueSelector: React.FC = () => {
  const { leagues, currentLeague, selectLeague } = useAuth();
  const [selectedLeague, setSelectedLeague] = React.useState('');

  useEffect(() => {
    // Auto-select if only one league
    if (leagues.length === 1 && !currentLeague) {
      handleLeagueSelect(leagues[0].id);
    }
  }, [leagues, currentLeague]);

  const handleLeagueSelect = async (leagueId: string) => {
    setSelectedLeague(leagueId);
    await selectLeague(leagueId);
  };

  // If user already has a league selected, don't show selector
  if (currentLeague) {
    return null;
  }

  // If no leagues available
  if (leagues.length === 0) {
    return (
      <Box pad="large" align="center">
        <Heading level="3">No Leagues Available</Heading>
        <Text>Please contact an administrator to be added to a league.</Text>
      </Box>
    );
  }

  // Auto-selecting for single league
  if (leagues.length === 1) {
    return (
      <Box pad="large" align="center">
        <Text>Setting up your league access...</Text>
      </Box>
    );
  }

  return (
    <Box pad="large" align="center" gap="medium">
      <Heading level="3">Select Your League</Heading>
      <Box width="medium">
        <Select
          options={leagues}
          labelKey="name"
          valueKey="id"
          value={selectedLeague}
          onChange={({ option }) => handleLeagueSelect(option.id)}
          placeholder="Choose a league"
        />
      </Box>
    </Box>
  );
};
