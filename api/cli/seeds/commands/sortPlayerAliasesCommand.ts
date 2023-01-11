import { Command } from 'commander';
import figlet from 'figlet';

import { sortPlayerAliases } from '../handler/sortPlayerAliases';

const command = new Command('sort-player-aliases')
  .description('Sorts the player_aliases seed file')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .action(sortPlayerAliases);

export const sortPlayerAliasesCommand = command;
