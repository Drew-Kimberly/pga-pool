import { Command, Option } from 'commander';
import figlet from 'figlet';

import { DEFAULT_TOURNAMENT_ID } from '../constants';
import { getPgaTournamentLeaderboard } from '../handler/getPgaTournamentLeaderboard';

const command = new Command('get')
  .description('Gets a PGA Tournament Leaderboard via the PGA Tour API')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addOption(
    new Option(
      '--tournamentId <tournamentId>',
      'Specify the tournament ID. Defaults to the tournament currently being played, if applicable.'
    ).default(DEFAULT_TOURNAMENT_ID)
  )
  .addOption(
    new Option(
      '--year <year>',
      'Specify the tournament year. Defaults to the current year'
    ).default(new Date().getFullYear().toString())
  )
  .action((opts) => getPgaTournamentLeaderboard(opts.tournamentId, opts.year));

export const getPgaTournamentLeaderboardCommand = command;
