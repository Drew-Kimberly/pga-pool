import { Box, Grid, ResponsiveContext, Text } from 'grommet';
import React from 'react';

import { pgaPoolApi } from '../../api/pga-pool/api';
import { useTournamentLayoutContext } from '../TournamentLayout/TournamentLayout';

import { PgaPlayer, PgaTournament } from '@drewkimberly/pga-pool-api';

export function TournamentOverview() {
  const { tournament } = useTournamentLayoutContext();
  const pgaTournament = tournament.pga_tournament;
  const size = React.useContext(ResponsiveContext);
  const isDesktop = size !== 'small';

  const champion = useChampion(pgaTournament.previous_champion);

  return (
    <Box gap="medium">
      {/* Course section */}
      <OverviewSection title="Course">
        <Box gap="xsmall">
          <Text weight="bold" size="medium">
            {pgaTournament.course_name}
          </Text>
          <Box direction="row" gap="small">
            {pgaTournament.par != null && (
              <MetaItem label="PAR" value={String(pgaTournament.par)} />
            )}
            {pgaTournament.yardage != null && (
              <MetaItem label="YARDAGE" value={pgaTournament.yardage.toLocaleString()} />
            )}
          </Box>
        </Box>
      </OverviewSection>

      {/* Event details grid */}
      <OverviewSection title="Event Details">
        <Grid columns={{ count: isDesktop ? 3 : 2, size: 'auto' }} gap="medium">
          <MetaCard label="PURSE" value={formatPurse(pgaTournament.purse)} />
          {pgaTournament.fedex_cup_points != null && (
            <MetaCard label="FEDEXCUP" value={`${pgaTournament.fedex_cup_points} pts`} />
          )}
          <MetaCard label="FORMAT" value={formatScoringFormat(pgaTournament)} />
        </Grid>
      </OverviewSection>

      {/* Previous champion */}
      {pgaTournament.previous_champion?.name && (
        <OverviewSection title="Defending Champion">
          <ChampionDisplay name={pgaTournament.previous_champion.name} champion={champion} />
        </OverviewSection>
      )}
    </Box>
  );
}

function useChampion(previousChampion: PgaTournament['previous_champion']): PgaPlayer | undefined {
  const [champion, setChampion] = React.useState<PgaPlayer | undefined>();
  const championId = previousChampion?.id;

  React.useEffect(() => {
    if (championId == null) return;
    let cancelled = false;

    pgaPoolApi.pgaPlayers
      .getPgaPlayer({ pgaPlayerId: championId })
      .then((res) => {
        if (!cancelled) setChampion(res.data);
      })
      .catch(() => {
        // Player may not exist in DB — fall back to name-only display
      });

    return () => {
      cancelled = true;
    };
  }, [championId]);

  return champion;
}

interface ChampionDisplayProps {
  name: string;
  champion: PgaPlayer | undefined;
}

function ChampionDisplay({ name, champion }: ChampionDisplayProps) {
  return (
    <Box direction="row" align="center" gap="small">
      {champion?.headshot_url && (
        <Box
          width="48px"
          height="48px"
          round="full"
          overflow="hidden"
          flex={false}
          background="light-2"
        >
          <img
            src={champion.headshot_url}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      )}
      <Box>
        <Text weight="bold">{name}</Text>
        {champion?.country && (
          <Box direction="row" align="center" gap="xxsmall">
            {champion.country_flag_url && (
              <img
                src={champion.country_flag_url}
                alt={champion.country}
                style={{ width: '16px', height: '12px' }}
              />
            )}
            <Text size="small" color="text-weak">
              {champion.country}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

interface OverviewSectionProps {
  title: string;
  children: React.ReactNode;
}

function OverviewSection({ title, children }: OverviewSectionProps) {
  return (
    <Box
      gap="small"
      pad={{ vertical: 'small' }}
      border={{ side: 'top', size: 'xsmall', color: 'border' }}
    >
      <Text
        size="medium"
        weight="bold"
        style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}
      >
        {title}
      </Text>
      {children}
    </Box>
  );
}

interface MetaItemProps {
  label: string;
  value: string;
}

function MetaItem({ label, value }: MetaItemProps) {
  return (
    <Box direction="row" align="baseline" gap="xxsmall">
      <Text size="xsmall" color="text-weak" weight="bold" style={{ letterSpacing: '0.05em' }}>
        {label}
      </Text>
      <Text size="small" weight="bold">
        {value}
      </Text>
    </Box>
  );
}

interface MetaCardProps {
  label: string;
  value: string;
}

function MetaCard({ label, value }: MetaCardProps) {
  return (
    <Box gap="xxsmall">
      <Text size="xsmall" color="text-weak" weight="bold" style={{ letterSpacing: '0.05em' }}>
        {label}
      </Text>
      <Text
        size="medium"
        weight="bold"
        style={{ fontFamily: 'var(--font-display)', lineHeight: 1.2 }}
      >
        {value}
      </Text>
    </Box>
  );
}

function formatPurse(purse: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(purse);
}

function formatScoringFormat(tournament: PgaTournament): string {
  switch (tournament.scoring_format) {
    case 'STROKE_PLAY':
      return 'Stroke Play';
    case 'TEAM_STROKE':
      return 'Team Stroke';
    case 'STABLEFORD':
      return 'Stableford';
    default:
      return tournament.scoring_format;
  }
}
