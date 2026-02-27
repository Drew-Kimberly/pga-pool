import { useParams } from 'react-router';

import { ErrorPage } from '../components/ErrorPage';
import { PoolStandings } from '../components/PoolStandings';

import { withPageLayout } from './withPageLayout';

function _PoolStandingsPage() {
  const params = useParams();
  const poolId = params.poolId;

  if (!poolId) {
    return <ErrorPage title="Pool Not Found" message="A pool ID is required for this page." />;
  }

  return <PoolStandings poolId={poolId} />;
}

export const PoolStandingsPage = withPageLayout(_PoolStandingsPage);
