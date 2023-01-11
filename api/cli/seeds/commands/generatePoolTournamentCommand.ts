import { Command, Option } from 'commander';
import figlet from 'figlet';

import { generatePoolTournament } from '../handler/generatePoolTournament';

const command = new Command('generate-pool-tournament')
  .description('Generates a seed JSON file for the given PGA tournament pick sheet')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addOption(
    new Option(
      '--pickSheet <filepath>',
      'Path the tournament pick sheet in TXT format (required)'
    ).makeOptionMandatory()
  )
  .addOption(
    new Option('--tournamentId <id>', 'PGA Tournament ID (required)').makeOptionMandatory()
  )
  .addOption(
    new Option('--year <year>', 'PGA Tournament year. Defaults to the current year').default(
      new Date().getFullYear().toString()
    )
  )
  .action((opts) => generatePoolTournament(opts.pickSheet, opts.tournamentId, opts.year));

export const generatePoolTournamentCommand = command;
