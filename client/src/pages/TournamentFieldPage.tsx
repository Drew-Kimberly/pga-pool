import { useParams } from 'react-router-dom';

import { TournamentField } from '../components/TournamentField';

import { withPageLayout } from './withPageLayout';

function _TournamentFieldPage() {
  const params = useParams();
  return <TournamentField pgaTournamentId={params.pgaTournamentId as string} />;
}

export const TournamentFieldPage = withPageLayout(_TournamentFieldPage);
