import { Command, Option } from 'commander';
import figlet from 'figlet';

import { generateTournamentField } from '../handler/generateTournamentField';

const command = new Command('generate-field')
  .description('Generates a PGA Tournament field tiered using odds to win')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addOption(
    new Option(
      '--pgaTournamentId <id>',
      'The PGA Tournament ID to generate the field for'
    ).makeOptionMandatory()
  )
  .addOption(
    new Option(
      '--tiers <oddsCutoffList>',
      'The odds cutoff for each tier. Represented as a comma-delimited list'
    ).makeOptionMandatory()
  )
  .action((opts) => {
    return generateTournamentField(opts.pgaTournamentId, opts.tiers.split(',').map(Number));
  });

export const generateTournamentFieldCommand = command;
