import { Command, Option } from 'commander';
import figlet from 'figlet';

import { backfillScoring } from '../handler/backfillScoring';

const command = new Command('backfill-scoring')
  .description('Backfill scoring data (holes + strokes) for completed tournaments')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addOption(
    new Option(
      '--year <year>',
      '[Optional] Specify PGA Tour year to backfill (defaults to current year)'
    ).default('')
  )
  .addOption(
    new Option(
      '--tournamentId <tournamentId>',
      '[Optional] Specify a single PGA Tour tournament ID to backfill (e.g. R2026010)'
    ).default('')
  )
  .action((opts) => backfillScoring(opts.year, opts.tournamentId));

export const backfillScoringCommand = command;
