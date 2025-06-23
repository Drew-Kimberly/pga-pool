import { useEffect, useState } from 'react';

import { useAuth0 } from '@auth0/auth0-react';

interface League {
  id: string;
  name: string;
  isOwner: boolean;
}

interface AuthUser {
  userId: string;
  email: string;
  name: string;
  isAdmin: boolean;
  leagueId?: string;
  leagues: League[];
}

export const useAuth = () => {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently, loginWithRedirect, logout } =
    useAuth0();

  const [currentLeague, setCurrentLeague] = useState<League | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [authUser, _setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (user) {
      const namespace = 'https://pga-pool.drewk.dev/';
      const userLeagues = user[`${namespace}leagues`] || [];
      const activeLeagueId = user[`${namespace}league_id`];

      setLeagues(userLeagues);
      if (activeLeagueId && userLeagues.length > 0) {
        setCurrentLeague(userLeagues.find((l: League) => l.id === activeLeagueId) || null);
      }
    }
  }, [user]);

  const selectLeague = async (leagueId: string) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_PGA_POOL_API_URL}/auth/league`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leagueId }),
      });

      if (response.ok) {
        // Force token refresh to get new league claim
        await getAccessTokenSilently({ cacheMode: 'off' });
        window.location.reload();
      } else {
        // Handle non-ok responses
        const errorText = await response.text();
        throw new Error(`Failed to select league: ${response.status} ${errorText}`);
      }
    } catch (error) {
      // Navigate to error page
      window.location.href = `/error?error=league_selection_failed&error_description=${encodeURIComponent(
        error instanceof Error ? error.message : 'Failed to select league'
      )}`;
    }
  };

  const login = () => {
    loginWithRedirect({
      appState: { returnTo: window.location.pathname },
    });
  };

  const logoutUser = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    authUser,
    currentLeague,
    leagues,
    selectLeague,
    login,
    logout: logoutUser,
    getAccessToken: getAccessTokenSilently,
  };
};
