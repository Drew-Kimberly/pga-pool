import { createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from './components/ErrorPage';
import { AuthErrorPage } from './pages/AuthErrorPage';
import { PostLoginPage } from './pages/PostLoginPage';
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
