import { Command } from 'commander';
import figlet from 'figlet';

import { updatePoolTournamentScores } from '../handler/updatePoolTournamentScores';

const command = new Command('update-scores')
  .description('Update scores for a pool tournament using the PGA Tour API')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<pgaTournamentId>', 'Specify which PGA Tournament to update scores for')
  .action(updatePoolTournamentScores);

export const updatePoolTournamentScoresCommand = command;
