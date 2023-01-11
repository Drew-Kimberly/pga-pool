import { Command } from 'commander';
import figlet from 'figlet';

import { getPgaTournamentLeaderboardCommand } from './commands/get';

const command = new Command('pga-tournament-leaderboard')
  .description('Manage PGA Tournament Leaderboards')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(getPgaTournamentLeaderboardCommand);

export const pgaTournamentLeaderboardCommand = command;
