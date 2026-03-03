import { createBrowserRouter } from 'react-router';

import { ErrorPage } from './components/ErrorPage';
import { PoolTournamentField } from './components/PoolTournamentField';
import { TournamentDefaultRedirect } from './components/TournamentLayout/TournamentLayout';
import { TournamentLeaderboard } from './components/TournamentLeaderboard';
import { TournamentOverview } from './components/TournamentOverview/TournamentOverview';
import { AuthErrorPage } from './pages/AuthErrorPage';
import { LeaderboardAliasPage } from './pages/LeaderboardAliasPage';
import { PoolLeaderboardAliasPage } from './pages/PoolLeaderboardAliasPage';
import { PoolStandingsAliasPage } from './pages/PoolStandingsAliasPage';
import { PoolStandingsPage } from './pages/PoolStandingsPage';
import { PoolTournamentFieldAliasPage } from './pages/PoolTournamentFieldAliasPage';
import { PoolTournamentLayoutPage } from './pages/PoolTournamentLayoutPage';
import { PoolTournamentsAliasPage } from './pages/PoolTournamentsAliasPage';
import { PoolTournamentsPage } from './pages/PoolTournamentsPage';
import { PostLoginPage } from './pages/PostLoginPage';
import { TournamentFieldPage } from './pages/TournamentFieldPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LeaderboardAliasPage />,
  },
  {
    path: 'leaderboard',
    element: <LeaderboardAliasPage />,
  },
  {
    path: 'pools/:poolId/leaderboard',
    element: <PoolLeaderboardAliasPage />,
  },
  {
    path: 'pools/:poolId/tournaments/:poolTournamentId',
    element: <PoolTournamentLayoutPage />,
    children: [
      {
        index: true,
        element: <TournamentDefaultRedirect />,
      },
      {
        path: 'leaderboard',
        element: <TournamentLeaderboard />,
      },
      {
        path: 'results',
        element: <TournamentLeaderboard />,
      },
      {
        path: 'field',
        element: <PoolTournamentField />,
      },
      {
        path: 'overview',
        element: <TournamentOverview />,
      },
    ],
  },
  {
    path: 'pga-tournaments/weekly-field',
    element: <PoolTournamentFieldAliasPage />,
  },
  {
    path: 'pool-tournament-field',
    element: <PoolTournamentFieldAliasPage />,
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
    path: 'pools/:poolId/tournaments',
    element: <PoolTournamentsPage />,
  },
  {
    path: 'pool-standings',
    element: <PoolStandingsAliasPage />,
  },
  {
    path: 'pool-tournaments',
    element: <PoolTournamentsAliasPage />,
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
