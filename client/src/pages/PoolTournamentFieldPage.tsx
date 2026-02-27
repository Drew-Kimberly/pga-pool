import { useParams } from 'react-router';

import { ErrorPage } from '../components/ErrorPage';
import { PoolTournamentField } from '../components/PoolTournamentField';

import { withPageLayout } from './withPageLayout';

function _PoolTournamentFieldPage() {
  const { poolId, poolTournamentId } = useParams();

  if (!poolId || !poolTournamentId) {
    return (
      <ErrorPage
        title="Tournament Not Found"
        message="A pool ID and pool tournament ID are required for this page."
      />
    );
  }

  return <PoolTournamentField poolId={poolId} poolTournamentId={poolTournamentId} />;
}

export const PoolTournamentFieldPage = withPageLayout(_PoolTournamentFieldPage);
