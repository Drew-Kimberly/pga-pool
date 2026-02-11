import { createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from './components/ErrorPage';
import { AuthErrorPage } from './pages/AuthErrorPage';
import { DataDeletionPage } from './pages/DataDeletionPage';
import { PostLoginPage } from './pages/PostLoginPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
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
    path: '/privacy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '/data-deletion',
    element: <DataDeletionPage />,
  },
  {
    path: '*',
    element: (
      <ErrorPage title="Page Not Found" message="The page you're looking for doesn't exist." />
    ),
  },
]);
