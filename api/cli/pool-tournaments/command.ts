import { Command } from 'commander';
import figlet from 'figlet';

import { updatePoolTournamentScoresCommand } from './commands/updatePoolTournamentScoresCommand';

const command = new Command('pool-tournaments')
  .description('Manage Pool Tournaments')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(updatePoolTournamentScoresCommand);

export const poolTournamentsCommand = command;
