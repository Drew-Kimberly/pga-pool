import { createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from './components/ErrorPage';
import { AuthErrorPage } from './pages/AuthErrorPage';
import { PoolStandingsAliasPage } from './pages/PoolStandingsAliasPage';
import { PoolStandingsPage } from './pages/PoolStandingsPage';
import { PostLoginPage } from './pages/PostLoginPage';
import { TournamentFieldPage } from './pages/TournamentFieldPage';
import { WeeklyTournamentFieldPage } from './pages/WeeklyTournamentFieldPage';
import { TournamentLeaderboardPage } from './pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TournamentLeaderboardPage />,
  },
  {
    path: 'pga-tournaments/weekly-field',
    element: <WeeklyTournamentFieldPage />,
  },
  {
    path: 'pga-tournaments/:pgaTournamentId/field',
    element: <TournamentFieldPage />,
  },
  {
    path: 'pools/:poolId/standings',
    element: <PoolStandingsPage />,
  },
  {
    path: 'pool-standings',
    element: <PoolStandingsAliasPage />,
  },
  {
    path: '/post-login',
    element: <PostLoginPage />,
  },
  {
    path: '/error/auth',
    element: <AuthErrorPage />,
  },
  {
    path: '/error',
    element: <ErrorPage />,
  },
  {
    path: '*',
    element: (
      <ErrorPage title="Page Not Found" message="The page you're looking for doesn't exist." />
    ),
  },
]);
