import { useParams } from 'react-router';

import { ErrorPage } from '../components/ErrorPage';
import { TournamentLayout } from '../components/TournamentLayout/TournamentLayout';

import { withPageLayout } from './withPageLayout';

function _PoolTournamentLayoutPage() {
  const { poolId, poolTournamentId } = useParams();

  if (!poolId || !poolTournamentId) {
    return (
      <ErrorPage
        title="Tournament Not Found"
        message="A pool ID and pool tournament ID are required for this page."
      />
    );
  }

  return <TournamentLayout poolId={poolId} poolTournamentId={poolTournamentId} />;
}

export const PoolTournamentLayoutPage = withPageLayout(_PoolTournamentLayoutPage);
