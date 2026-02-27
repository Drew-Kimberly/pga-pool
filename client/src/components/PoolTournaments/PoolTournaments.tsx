import { Box, Button, Notification, PageContent, ResponsiveContext, Text } from 'grommet';
import { CircleInformation, FormNext } from 'grommet-icons';
import React from 'react';
import { useNavigate } from 'react-router';

import { pgaPoolApi } from '../../api/pga-pool';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Spinner } from '../Spinner';
import { resolveDefaultTournamentFromList } from '../TournamentLeaderboard/resolveTournament';

import {
  PgaTournamentTournamentStatusEnum,
  Pool,
  PoolTournament,
} from '@drewkimberly/pga-pool-api';

type SectionTab = 'results' | 'upcoming';

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
  const { darkMode } = useThemeContext();

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

  const currentTournaments = React.useMemo(() => {
    if (!tournaments.length) {
      return [];
    }

    const current: PoolTournament[] = [];

    if (weeklyTournamentId) {
      const weekly = tournaments.find((entry) => entry.pga_tournament.id === weeklyTournamentId);
      if (weekly) {
        current.push(weekly);
      }
    }

    if (!current.length) {
      const resolved = resolveDefaultTournamentFromList(tournaments);
      if (resolved) {
        current.push(resolved);
      }
    }

    // Completed tournaments with pending official scores belong in Current Week
    const currentIds = new Set(current.map((t) => t.id));
    tournaments
      .filter(
        (entry) =>
          !currentIds.has(entry.id) &&
          !entry.scores_are_official &&
          entry.pga_tournament.tournament_status === PgaTournamentTournamentStatusEnum.Completed
      )
      .forEach((entry) => current.push(entry));

    return current;
  }, [tournaments, weeklyTournamentId]);

  const currentTournamentIds = React.useMemo(
    () => new Set(currentTournaments.map((t) => t.id)),
    [currentTournaments]
  );

  const officialTournaments = React.useMemo(() => {
    return tournaments
      .filter((entry) => entry.scores_are_official && !currentTournamentIds.has(entry.id))
      .sort((a, b) => {
        return (
          new Date(b.pga_tournament.date.start).getTime() -
          new Date(a.pga_tournament.date.start).getTime()
        );
      });
  }, [currentTournamentIds, tournaments]);

  const upcomingTournaments = React.useMemo(() => {
    return tournaments
      .filter(
        (entry) =>
          !entry.scores_are_official &&
          !currentTournamentIds.has(entry.id) &&
          entry.pga_tournament.tournament_status !== PgaTournamentTournamentStatusEnum.Completed
      )
      .sort((a, b) => {
        return (
          new Date(a.pga_tournament.date.start).getTime() -
          new Date(b.pga_tournament.date.start).getTime()
        );
      });
  }, [currentTournamentIds, tournaments]);

  const defaultTab: SectionTab = officialTournaments.length > 0 ? 'results' : 'upcoming';
  const [activeTab, setActiveTab] = React.useState<SectionTab>(defaultTab);

  // Update default tab when data loads
  React.useEffect(() => {
    setActiveTab(officialTournaments.length > 0 ? 'results' : 'upcoming');
  }, [officialTournaments.length]);

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
          {currentTournaments.length === 0 ? (
            <EmptySectionMessage message="No tournament has been scheduled for this pool yet." />
          ) : (
            <Box gap="small">
              {currentTournaments.map((entry) => (
                <TournamentCard
                  key={entry.id}
                  tournament={entry}
                  canNavigate={true}
                  onNavigate={() =>
                    navigate(`/pools/${pool.id}/tournaments/${entry.id}/leaderboard`)
                  }
                  onFieldNavigate={() =>
                    navigate(`/pools/${pool.id}/tournaments/${entry.id}/field`)
                  }
                  statusLabel={toCurrentStatusLabel(entry)}
                />
              ))}
            </Box>
          )}
        </Section>

        <Box gap="small">
          <SegmentedControl
            activeTab={activeTab}
            onTabChange={setActiveTab}
            darkMode={darkMode}
            resultsCount={officialTournaments.length}
            upcomingCount={upcomingTournaments.length}
          />

          {activeTab === 'results' ? (
            officialTournaments.length === 0 ? (
              <EmptySectionMessage message="Official results will appear here after scores are finalized." />
            ) : (
              <Box gap="small">
                {officialTournaments.map((entry) => (
                  <TournamentCard
                    key={entry.id}
                    tournament={entry}
                    canNavigate={true}
                    onNavigate={() => navigate(`/pools/${pool.id}/tournaments/${entry.id}/results`)}
                    onFieldNavigate={() =>
                      navigate(`/pools/${pool.id}/tournaments/${entry.id}/field`)
                    }
                    statusLabel="Official"
                    navigateLabel="View results"
                  />
                ))}
              </Box>
            )
          ) : upcomingTournaments.length === 0 ? (
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
        </Box>
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

interface SegmentedControlProps {
  activeTab: SectionTab;
  onTabChange: (tab: SectionTab) => void;
  darkMode: boolean;
  resultsCount: number;
  upcomingCount: number;
}

function SegmentedControl({
  activeTab,
  onTabChange,
  darkMode,
  resultsCount,
  upcomingCount,
}: SegmentedControlProps) {
  const activeBg = darkMode ? '#2b62c8' : 'brand';
  const activeBorder = darkMode ? '#8eb3ff' : '#273344';
  const inactiveText = darkMode ? 'light-3' : 'text-weak';

  const tabs: { key: SectionTab; label: string; count: number }[] = [
    { key: 'results', label: 'Official Results', count: resultsCount },
    { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
  ];

  return (
    <Box
      direction="row"
      round="small"
      border={{ size: 'xsmall', color: 'border' }}
      background="background-front"
      overflow="hidden"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Button key={tab.key} plain onClick={() => onTabChange(tab.key)} style={{ flex: 1 }}>
            <Box
              pad={{ vertical: 'small', horizontal: 'xsmall' }}
              align="center"
              background={isActive ? activeBg : undefined}
              border={isActive ? { size: 'xsmall', color: activeBorder } : undefined}
              round={isActive ? 'small' : undefined}
              style={
                isActive && darkMode
                  ? {
                      boxShadow:
                        '0 0 0 1px rgba(142, 179, 255, 0.35), 0 4px 12px rgba(43, 98, 200, 0.3)',
                    }
                  : undefined
              }
            >
              <Text
                size="small"
                weight={isActive ? 'bold' : undefined}
                color={isActive ? 'white' : inactiveText}
              >
                {tab.label}
                {tab.count > 0 ? ` (${tab.count})` : ''}
              </Text>
            </Box>
          </Button>
        );
      })}
    </Box>
  );
}

interface TournamentCardProps {
  tournament: PoolTournament;
  canNavigate: boolean;
  statusLabel: string;
  onNavigate?: () => void;
  navigateLabel?: string;
  onFieldNavigate?: () => void;
}

function TournamentCard({
  tournament,
  canNavigate,
  statusLabel,
  onNavigate,
  navigateLabel = 'View leaderboard',
  onFieldNavigate,
}: TournamentCardProps) {
  const logoUrl = tournament.pga_tournament.logo_url;
  const size = React.useContext(ResponsiveContext);
  const isDesktop = size !== 'small';

  const content = (
    <Box
      pad={{ horizontal: 'medium', vertical: 'medium' }}
      round="small"
      border={{ size: 'xsmall', color: 'border' }}
      background="background-front"
    >
      <Box direction="row" gap="medium">
        {/* Left: all text content */}
        <Box flex gap="small" justify="center">
          <Box gap="xxsmall">
            <Box direction="row" align="center" gap="small">
              <Text
                size="xsmall"
                color="text-weak"
                weight="bold"
                style={{ letterSpacing: '0.04em' }}
              >
                {tournament.pga_tournament.date.display_short}
              </Text>
              <StatusPill label={statusLabel} />
            </Box>
            <Text size="medium" weight="bold">
              {tournament.pga_tournament.name}
            </Text>
            <Text size="small" color="text-weak">
              {tournament.pga_tournament.course_name}
            </Text>
          </Box>

          <Box direction="row" gap={isDesktop ? 'large' : 'medium'} wrap>
            <Box gap="xxsmall">
              <Text
                size="xsmall"
                color="text-weak"
                style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                Purse
              </Text>
              <Text size="small" weight="bold">
                {CURRENCY.format(tournament.pga_tournament.purse)}
              </Text>
            </Box>
            <Box gap="xxsmall">
              <Text
                size="xsmall"
                color="text-weak"
                style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                FedEx Cup
              </Text>
              <Text size="small" weight="bold">
                {toFedexCupLabel(tournament.pga_tournament.fedex_cup_points)}
              </Text>
            </Box>
          </Box>

          <Box direction="row" align="center" gap="medium">
            {canNavigate && (
              <Box direction="row" align="center" gap="xsmall">
                <Text size="small" weight="bold" style={{ textDecoration: 'underline' }}>
                  {navigateLabel}
                </Text>
                <FormNext size="small" />
              </Box>
            )}
            {onFieldNavigate && (
              <Box
                direction="row"
                align="center"
                gap="xsmall"
                onClick={(e) => {
                  e.stopPropagation();
                  onFieldNavigate();
                }}
                style={{ cursor: 'pointer' }}
              >
                <Text size="small" weight="bold" style={{ textDecoration: 'underline' }}>
                  View field
                </Text>
                <FormNext size="small" />
              </Box>
            )}
          </Box>
        </Box>

        {/* Right: logo centered */}
        {logoUrl && (
          <Box flex={false} align="center" justify="center">
            <Box
              width={isDesktop ? '130px' : '110px'}
              height={isDesktop ? '130px' : '110px'}
              round="full"
              overflow="hidden"
              border={{ size: 'xsmall', color: 'light-4' }}
              background="white"
              align="center"
              justify="center"
              style={{ flexShrink: 0 }}
            >
              <img
                src={logoUrl}
                alt=""
                style={{
                  width: isDesktop ? '110px' : '92px',
                  height: isDesktop ? '110px' : '92px',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
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
