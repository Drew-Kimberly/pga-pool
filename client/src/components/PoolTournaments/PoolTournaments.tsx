import { Box, Button, Notification, PageContent, ResponsiveContext, Text } from 'grommet';
import { CircleInformation } from 'grommet-icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { pgaPoolApi } from '../../api/pga-pool';
import { Spinner } from '../Spinner';
import { resolveDefaultTournamentFromList } from '../TournamentLeaderboard/resolveTournament';

import {
  PgaTournamentTournamentStatusEnum,
  Pool,
  PoolTournament,
} from '@drewkimberly/pga-pool-api';

const CURRENCY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export interface PoolTournamentsProps {
  poolId: string;
}

export function PoolTournaments({ poolId }: PoolTournamentsProps) {
  const [pool, setPool] = React.useState<Pool | null>(null);
  const [tournaments, setTournaments] = React.useState<PoolTournament[]>([]);
  const [weeklyTournamentId, setWeeklyTournamentId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<Error | undefined>(undefined);
  const size = React.useContext(ResponsiveContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      setFetchError(undefined);

      try {
        const [poolResponse, tournamentsResponse, resolvedWeeklyTournamentId] = await Promise.all([
          pgaPoolApi.pools.getPool({ poolId }),
          pgaPoolApi.poolTournaments.listPoolTournaments({
            poolId,
            page: { number: 1, size: 200 },
          }),
          pgaPoolApi.pgaTournamentField
            .getWeeklyField()
            .then((res) => res.data.pga_tournament.id)
            .catch((e) => {
              if (pgaPoolApi.is404Error(e as Error)) {
                return null;
              }
              throw e;
            }),
        ]);

        if (!isMounted) {
          return;
        }

        setPool(poolResponse.data);
        setTournaments(tournamentsResponse.data.data);
        setWeeklyTournamentId(resolvedWeeklyTournamentId);
      } catch (e) {
        if (!isMounted) {
          return;
        }

        if (!pgaPoolApi.is404Error(e as Error)) {
          console.error(e);
          setFetchError(e as Error);
        } else {
          setFetchError(new Error('Pool not found.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [poolId]);

  const currentTournament = React.useMemo(() => {
    if (!tournaments.length) {
      return null;
    }

    if (weeklyTournamentId) {
      const weekly = tournaments.find((entry) => entry.pga_tournament.id === weeklyTournamentId);
      if (weekly) {
        return weekly;
      }
    }

    return resolveDefaultTournamentFromList(tournaments);
  }, [tournaments, weeklyTournamentId]);

  const officialTournaments = React.useMemo(() => {
    return tournaments
      .filter((entry) => entry.scores_are_official && entry.id !== currentTournament?.id)
      .sort((a, b) => {
        return (
          new Date(b.pga_tournament.date.start).getTime() -
          new Date(a.pga_tournament.date.start).getTime()
        );
      });
  }, [currentTournament?.id, tournaments]);

  const upcomingTournaments = React.useMemo(() => {
    return tournaments
      .filter((entry) => !entry.scores_are_official && entry.id !== currentTournament?.id)
      .sort((a, b) => {
        return (
          new Date(a.pga_tournament.date.start).getTime() -
          new Date(b.pga_tournament.date.start).getTime()
        );
      });
  }, [currentTournament?.id, tournaments]);

  if (isLoading) {
    return (
      <PageContent>
        <Spinner />
      </PageContent>
    );
  }

  if (fetchError) {
    return (
      <PageContent>
        <Notification
          status="critical"
          title="Could not load tournaments"
          message={fetchError.message || 'Please refresh and try again.'}
        />
      </PageContent>
    );
  }

  if (!pool) {
    return (
      <PageContent>
        <Box height="medium" round="small" align="center" justify="center" gap="small">
          <CircleInformation size="large" />
          <Text size="large" textAlign="center">
            Pool not found.
          </Text>
        </Box>
      </PageContent>
    );
  }

  return (
    <PageContent pad={{ horizontal: 'small', vertical: 'medium' }}>
      <Box gap="medium">
        <Box
          round="medium"
          pad={{ horizontal: 'medium', vertical: 'medium' }}
          elevation="small"
          style={{
            background:
              'linear-gradient(145deg, rgba(22,27,34,0.98) 0%, rgba(33,48,66,0.98) 55%, rgba(43,64,87,0.98) 100%)',
          }}
          gap="small"
        >
          <Text size="medium" color="light-4" style={{ letterSpacing: '0.08em' }}>
            POOL TOURNAMENTS
          </Text>
          <Text size={size === 'small' ? 'large' : 'xlarge'} weight="bold" color="white">
            {pool.name}
          </Text>
        </Box>

        <Section title="Current Week">
          {currentTournament ? (
            <TournamentCard
              tournament={currentTournament}
              canNavigate={true}
              onNavigate={() =>
                navigate(`/pools/${pool.id}/tournaments/${currentTournament.id}/leaderboard`)
              }
              statusLabel={toCurrentStatusLabel(currentTournament)}
            />
          ) : (
            <EmptySectionMessage message="No tournament has been scheduled for this pool yet." />
          )}
        </Section>

        <Section title="Official Results">
          {officialTournaments.length === 0 ? (
            <EmptySectionMessage message="Official results will appear here after scores are finalized." />
          ) : (
            <Box gap="small">
              {officialTournaments.map((entry) => (
                <TournamentCard
                  key={entry.id}
                  tournament={entry}
                  canNavigate={true}
                  onNavigate={() =>
                    navigate(`/pools/${pool.id}/tournaments/${entry.id}/leaderboard`)
                  }
                  statusLabel="Official"
                />
              ))}
            </Box>
          )}
        </Section>

        <Section title="Upcoming">
          {upcomingTournaments.length === 0 ? (
            <EmptySectionMessage message="No additional upcoming tournaments are available." />
          ) : (
            <Box gap="small">
              {upcomingTournaments.map((entry) => (
                <TournamentCard
                  key={entry.id}
                  tournament={entry}
                  canNavigate={false}
                  statusLabel={toFutureStatusLabel(entry)}
                />
              ))}
            </Box>
          )}
        </Section>
      </Box>
    </PageContent>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <Box gap="small">
      <Text size="small" weight="bold" color="text-weak" style={{ letterSpacing: '0.06em' }}>
        {title.toUpperCase()}
      </Text>
      {children}
    </Box>
  );
}

interface TournamentCardProps {
  tournament: PoolTournament;
  canNavigate: boolean;
  statusLabel: string;
  onNavigate?: () => void;
}

function TournamentCard({ tournament, canNavigate, statusLabel, onNavigate }: TournamentCardProps) {
  const content = (
    <Box
      pad={{ horizontal: 'medium', vertical: 'medium' }}
      round="small"
      border={{ size: 'xsmall', color: 'border' }}
      background="background-front"
      gap="small"
      style={{ minHeight: '84px' }}
    >
      <Box direction="row" justify="between" align="start" gap="small">
        <Box gap="xxsmall" flex>
          <Text size="medium" weight="bold">
            {tournament.pga_tournament.name}
          </Text>
          <Text size="small" color="text-weak">
            {tournament.pga_tournament.date.display}
          </Text>
        </Box>
        <StatusPill label={statusLabel} />
      </Box>
      <Box direction="row" justify="between" wrap gap="small">
        <Text size="small" color="text-weak">{`FedEx Cup: ${toFedexCupLabel(
          tournament.pga_tournament.fedex_cup_points
        )}`}</Text>
        <Text size="small" color="text-weak">{`Purse: ${CURRENCY.format(
          tournament.pga_tournament.purse
        )}`}</Text>
      </Box>
      {canNavigate && (
        <Text size="small" weight="bold" style={{ textDecoration: 'underline' }}>
          View leaderboard →
        </Text>
      )}
    </Box>
  );

  if (!canNavigate || !onNavigate) {
    return content;
  }

  return (
    <Button plain onClick={onNavigate}>
      {content}
    </Button>
  );
}

interface StatusPillProps {
  label: string;
}

function StatusPill({ label }: StatusPillProps) {
  return (
    <Box
      pad={{ horizontal: 'small', vertical: 'xxsmall' }}
      round="small"
      border={{ size: 'xsmall', color: 'border' }}
      background="background"
      flex={false}
    >
      <Text size="xsmall" weight="bold">
        {label.toUpperCase()}
      </Text>
    </Box>
  );
}

interface EmptySectionMessageProps {
  message: string;
}

function EmptySectionMessage({ message }: EmptySectionMessageProps) {
  return (
    <Box
      pad="medium"
      round="small"
      border={{ size: 'xsmall', color: 'border' }}
      background="background-front"
    >
      <Text size="small" color="text-weak">
        {message}
      </Text>
    </Box>
  );
}

function toCurrentStatusLabel(tournament: PoolTournament): string {
  if (
    tournament.pga_tournament.tournament_status === PgaTournamentTournamentStatusEnum.InProgress
  ) {
    return 'Live';
  }

  if (
    tournament.pga_tournament.tournament_status === PgaTournamentTournamentStatusEnum.NotStarted
  ) {
    return 'This Week';
  }

  return tournament.scores_are_official ? 'Official' : 'In Progress';
}

function toFutureStatusLabel(tournament: PoolTournament): string {
  if (
    tournament.pga_tournament.tournament_status === PgaTournamentTournamentStatusEnum.NotStarted
  ) {
    return 'Upcoming';
  }

  return 'Pending';
}

function toFedexCupLabel(points: number | null): string {
  if (typeof points !== 'number') {
    return 'TBD';
  }

  return `${points}`;
}
