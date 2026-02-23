import { createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from './components/ErrorPage';
import { AuthErrorPage } from './pages/AuthErrorPage';
import { LeaderboardAliasPage } from './pages/LeaderboardAliasPage';
import { PoolLeaderboardAliasPage } from './pages/PoolLeaderboardAliasPage';
import { PoolStandingsAliasPage } from './pages/PoolStandingsAliasPage';
import { PoolStandingsPage } from './pages/PoolStandingsPage';
import { PoolTournamentLeaderboardPage } from './pages/PoolTournamentLeaderboardPage';
import { PoolTournamentResultsPage } from './pages/PoolTournamentResultsPage';
import { PoolTournamentsAliasPage } from './pages/PoolTournamentsAliasPage';
import { PoolTournamentsPage } from './pages/PoolTournamentsPage';
import { PostLoginPage } from './pages/PostLoginPage';
import { TournamentFieldPage } from './pages/TournamentFieldPage';
import { WeeklyTournamentFieldPage } from './pages/WeeklyTournamentFieldPage';

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
    path: 'pools/:poolId/tournaments/:poolTournamentId/leaderboard',
    element: <PoolTournamentLeaderboardPage />,
  },
  {
    path: 'pools/:poolId/tournaments/:poolTournamentId/results',
    element: <PoolTournamentResultsPage />,
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
