import { useParams } from 'react-router-dom';

import { ErrorPage } from '../components/ErrorPage';
import { TournamentLeaderboard } from '../components/TournamentLeaderboard';

import { withPageLayout } from './withPageLayout';

function _PoolTournamentResultsPage() {
  const { poolId, poolTournamentId } = useParams();

  if (!poolId || !poolTournamentId) {
    return (
      <ErrorPage
        title="Tournament Not Found"
        message="A pool ID and pool tournament ID are required for this page."
      />
    );
  }

  return (
    <TournamentLeaderboard
      poolId={poolId}
      poolTournamentId={poolTournamentId}
      backTo="tournaments"
    />
  );
}

export const PoolTournamentResultsPage = withPageLayout(_PoolTournamentResultsPage);
