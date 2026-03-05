import { Box, Button, Notification, PageContent, Text } from 'grommet';
import { CircleInformation, FormPrevious } from 'grommet-icons';
import React from 'react';
import { Navigate, NavLink, Outlet, useNavigate, useOutletContext } from 'react-router';

import { pgaPoolApi } from '../../api/pga-pool';
import { useInterval } from '../../hooks';
import { Spinner } from '../Spinner';
import { TournamentHeader } from '../TournamentHeader';

import { PgaTournamentTournamentStatusEnum, PoolTournament } from '@drewkimberly/pga-pool-api';

const TOURNAMENT_POLL_INTERVAL = 5 * 60 * 1000; // 5 min

export interface TournamentLayoutContext {
  tournament: PoolTournament;
  poolId: string;
  hasField: boolean;
}

export function useTournamentLayoutContext(): TournamentLayoutContext {
  return useOutletContext<TournamentLayoutContext>();
}

export interface TournamentLayoutProps {
  poolId: string;
  poolTournamentId: string;
}

export function TournamentLayout({ poolId, poolTournamentId }: TournamentLayoutProps) {
  const navigate = useNavigate();
  const [tournament, setTournament] = React.useState<PoolTournament | undefined>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | undefined>();
  const [hasField, setHasField] = React.useState<boolean | undefined>();

  React.useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      setError(undefined);

      try {
        const [tournamentRes, fieldAvailable] = await Promise.all([
          pgaPoolApi.poolTournaments.getPoolTournament({ poolId, poolTournamentId }),
          pgaPoolApi.poolTournamentField
            .getPoolTournamentField({ poolId, poolTournamentId })
            .then((res) => Object.keys(res.data.player_tiers ?? {}).length > 0)
            .catch(() => false),
        ]);

        if (isMounted) {
          setTournament(tournamentRes.data);
          setHasField(fieldAvailable);
        }
      } catch (e) {
        if (isMounted && !pgaPoolApi.is404Error(e as Error)) {
          setError(e as Error);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [poolId, poolTournamentId]);

  useInterval(async () => {
    if (!tournament) return;

    try {
      const res = await pgaPoolApi.poolTournaments.getPoolTournament({
        poolId,
        poolTournamentId: tournament.id,
      });
      setTournament(res.data);
    } catch {
      // Silent poll error
    }
  }, TOURNAMENT_POLL_INTERVAL);

  if (isLoading) {
    return (
      <PageContent>
        <Spinner />
      </PageContent>
    );
  }

  if (error) {
    return (
      <PageContent>
        <Notification
          status="critical"
          title="Could not load tournament"
          message={error.message || 'Please refresh and try again.'}
        />
      </PageContent>
    );
  }

  if (!tournament) {
    return (
      <PageContent>
        <Box height="medium" round="small" align="center" justify="center">
          <CircleInformation size="large" />
          <Text size="large" textAlign="center" margin="small">
            Tournament not found.
          </Text>
        </Box>
      </PageContent>
    );
  }

  const fieldAvailable = hasField ?? false;
  const context: TournamentLayoutContext = { tournament, poolId, hasField: fieldAvailable };
  const tabs = getTabs(tournament, fieldAvailable);

  return (
    <PageContent>
      <Box gap="none">
        {/* Back link */}
        <Box pad={{ top: 'small' }}>
          <Button
            plain
            onClick={() => navigate(`/pools/${poolId}/tournaments`)}
            style={{ alignSelf: 'flex-start' }}
          >
            <Box direction="row" align="center" gap="xsmall">
              <FormPrevious size="small" />
              <Text size="small" weight="bold">
                All tournaments
              </Text>
            </Box>
          </Button>
        </Box>

        {/* Simplified header */}
        <TournamentHeader tournament={tournament.pga_tournament} />

        {/* Tab bar */}
        <Box
          as="nav"
          direction="row"
          gap="medium"
          style={{ borderBottom: '1px solid var(--color-tab-border, #e5e7eb)' }}
          margin={{ bottom: 'medium' }}
        >
          {tabs.map((tab) => (
            <NavLink key={tab.path} to={tab.path} replace end style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <Box
                  pad={{
                    vertical: 'small',
                    horizontal: 'xxsmall',
                  }}
                  style={{
                    borderBottom: isActive
                      ? '3px solid var(--color-tab-active, #1a1a1a)'
                      : '3px solid transparent',
                    marginBottom: '-1px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, color 0.15s ease',
                  }}
                >
                  <Text
                    size="small"
                    weight={isActive ? 'bold' : undefined}
                    color={isActive ? undefined : 'text-weak'}
                    style={{
                      letterSpacing: '0.01em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </Text>
                </Box>
              )}
            </NavLink>
          ))}
        </Box>

        {/* Child route content */}
        <Outlet context={context} />
      </Box>
    </PageContent>
  );
}

/**
 * Smart index redirect based on tournament status and field availability.
 */
export function TournamentDefaultRedirect() {
  const { tournament, hasField } = useTournamentLayoutContext();
  const status = tournament.pga_tournament.tournament_status;

  if (status === PgaTournamentTournamentStatusEnum.InProgress) {
    return <Navigate to="leaderboard" replace />;
  }

  if (status === PgaTournamentTournamentStatusEnum.Completed) {
    return <Navigate to="results" replace />;
  }

  // NOT_STARTED: go to field if available, otherwise overview
  if (hasField) {
    return <Navigate to="field" replace />;
  }

  return <Navigate to="overview" replace />;
}

interface Tab {
  label: string;
  path: string;
}

function getTabs(tournament: PoolTournament, hasField: boolean): Tab[] {
  const status = tournament.pga_tournament.tournament_status;
  const tabs: Tab[] = [];

  if (status === PgaTournamentTournamentStatusEnum.InProgress) {
    tabs.push({ label: 'Leaderboard', path: 'leaderboard' });
  }

  if (status === PgaTournamentTournamentStatusEnum.Completed) {
    tabs.push({ label: 'Results', path: 'results' });
  }

  if (hasField) {
    tabs.push({ label: 'Field', path: 'field' });
  }

  tabs.push({ label: 'Overview', path: 'overview' });

  return tabs;
}
