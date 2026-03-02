import { Command, Option } from 'commander';
import figlet from 'figlet';

import { backfillOdds } from '../handler/backfillOdds';

const command = new Command('backfill-odds')
  .description(
    'Backfills pool_tournament_player.odds and pool_tournament.field_published_at from seed field.json files'
  )
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addOption(new Option('--year <year>', 'Only backfill seeds for the given year'))
  .action((opts) => backfillOdds(opts.year ? Number(opts.year) : undefined));

export const backfillOddsCommand = command;
