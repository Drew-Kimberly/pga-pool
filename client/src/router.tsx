import { createBrowserRouter } from 'react-router-dom';

import { TournamentFieldPage } from './pages/TournamentFieldPage';
import { TournamentLeaderboardPage } from './pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TournamentLeaderboardPage />,
  },
  {
    path: 'pga-tournaments/:pgaTournamentId/field',
    element: <TournamentFieldPage />,
  },
]);
