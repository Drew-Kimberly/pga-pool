import { WeeklyTournamentField } from '../components/WeeklyTournamentField';

import { withPageLayout } from './withPageLayout';

function _WeeklyTournamentFieldPage() {
  return <WeeklyTournamentField />;
}

export const WeeklyTournamentFieldPage = withPageLayout(_WeeklyTournamentFieldPage);
