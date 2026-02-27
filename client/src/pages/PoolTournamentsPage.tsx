import { useParams } from 'react-router';

import { ErrorPage } from '../components/ErrorPage';
import { PoolTournaments } from '../components/PoolTournaments';

import { withPageLayout } from './withPageLayout';

function _PoolTournamentsPage() {
  const params = useParams();
  const poolId = params.poolId;

  if (!poolId) {
    return <ErrorPage title="Pool Not Found" message="A pool ID is required for this page." />;
  }

  return <PoolTournaments poolId={poolId} />;
}

export const PoolTournamentsPage = withPageLayout(_PoolTournamentsPage);
