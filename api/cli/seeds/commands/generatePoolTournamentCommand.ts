import { Command, Option } from 'commander';
import figlet from 'figlet';

import { generatePoolTournament } from '../handler/generatePoolTournament';

const command = new Command('generate-pool-tournament')
  .description(
    'Creates pool tournament data from seeds/<PGA_TOURNAMENT_ID>/field.json and picks.json'
  )
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addOption(
    new Option('--tournamentId <id>', 'PGA Tournament ID (required)').makeOptionMandatory()
  )
  .action((opts) => generatePoolTournament(opts.tournamentId));

export const generatePoolTournamentCommand = command;
