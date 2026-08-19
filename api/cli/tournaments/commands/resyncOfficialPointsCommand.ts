import { Command, Option } from 'commander';
import figlet from 'figlet';

import { resyncOfficialPoints } from '../handler/resyncOfficialPoints';

const command = new Command('resync-official-points')
  .description(
    'Re-sync official FedEx Cup points for completed tournaments from the PGA Tour API, ' +
      'correcting players and (already-finalized) pool scores that diverged'
  )
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addOption(
    new Option(
      '--tournamentId <tournamentId>',
      '[Optional] Specify a single PGA Tour tournament ID to resync (e.g. R2026027)'
    ).default('')
  )
  .addOption(
    new Option(
      '--year <year>',
      '[Optional] Resync all completed FedEx Cup tournaments for a year (defaults to current year)'
    ).default('')
  )
  .addOption(new Option('--dryRun', 'Report corrections without writing anything').default(false))
  .action((opts) => resyncOfficialPoints(opts.tournamentId, opts.year, opts.dryRun));

export const resyncOfficialPointsCommand = command;
