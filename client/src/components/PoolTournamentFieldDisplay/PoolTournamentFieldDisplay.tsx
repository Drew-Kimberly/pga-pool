import { Box, Button, Grid, Heading, ResponsiveContext, Text, TextInput } from 'grommet';
import { Search, User as UserIcon } from 'grommet-icons';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { getOptimizedHeadshotUrl } from '../../cloudinary';
import { useThemeContext } from '../../contexts/ThemeContext';

import { PoolTournamentField, PoolTournamentPlayer } from '@drewkimberly/pga-pool-api';

type ViewMode = 'tier' | 'name';

export interface PoolTournamentFieldDisplayProps {
  field: PoolTournamentField;
}

export function PoolTournamentFieldDisplay({ field }: PoolTournamentFieldDisplayProps) {
  const size = useContext(ResponsiveContext);
  const { darkMode } = useThemeContext();
  const isDesktop = size !== 'small';

  const [viewMode, setViewMode] = useState<ViewMode>('tier');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchOpen = useCallback(() => {
    setSearchOpen(true);
  }, []);

  const handleSearchCancel = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const allPlayers = useMemo(() => {
    const players: PoolTournamentPlayer[] = [];
    for (const tierPlayers of Object.values(field.player_tiers)) {
      players.push(...tierPlayers);
    }
    return players;
  }, [field.player_tiers]);

  const searchActive = searchQuery.trim().length > 0;

  const areOddsAvailable = useMemo(
    () => allPlayers.some((p) => p.odds != null && p.odds !== ''),
    [allPlayers]
  );

  const filteredByName = useMemo(() => {
    if (!searchActive) return allPlayers;
    const q = searchQuery.toLowerCase();
    return allPlayers.filter((p) =>
      p.pga_tournament_player.pga_player.name.toLowerCase().includes(q)
    );
  }, [allPlayers, searchQuery, searchActive]);

  const filteredTiers = useMemo(() => {
    if (!searchActive) return field.player_tiers;
    const q = searchQuery.toLowerCase();
    const result: { [key: string]: PoolTournamentPlayer[] } = {};
    for (const [tier, players] of Object.entries(field.player_tiers)) {
      result[tier] = players.filter((p) =>
        p.pga_tournament_player.pga_player.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [field.player_tiers, searchQuery, searchActive]);

  // On desktop, always show expanded search bar
  const showExpandedSearch = isDesktop || searchOpen;

  return (
    <Box gap="medium">
      <Box direction="row" align="center" justify="between" wrap={false} gap="small">
        {showExpandedSearch ? (
          <Box direction="row" align="center" gap="small" flex style={{ minWidth: 0 }}>
            <Box
              direction="row"
              align="center"
              gap="small"
              round="large"
              border={{ size: 'xsmall', color: 'border' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              background="background-front"
              width={isDesktop ? { max: '400px' } : undefined}
              flex={!isDesktop}
              style={{ minWidth: 0 }}
            >
              <Search size="small" />
              <TextInput
                ref={searchInputRef}
                plain
                placeholder="Search player name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: 0, outline: 'none', boxShadow: 'none' }}
                focusIndicator={false}
              />
            </Box>
            {!isDesktop && (
              <Button plain onClick={handleSearchCancel}>
                <Text size="small" color="text-weak" style={{ whiteSpace: 'nowrap' }}>
                  Cancel
                </Text>
              </Button>
            )}
          </Box>
        ) : (
          <Button plain onClick={handleSearchOpen}>
            <Box
              direction="row"
              align="center"
              gap="xsmall"
              round="large"
              border={{ size: 'xsmall', color: 'border' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              background="background-front"
            >
              <Search size="small" color="text-weak" />
              <Text size="small" color="placeholder" style={{ whiteSpace: 'nowrap' }}>
                Search player name
              </Text>
            </Box>
          </Button>
        )}
        {(!searchOpen || isDesktop) && (
          <ViewToggle
            activeView={viewMode}
            onViewChange={setViewMode}
            darkMode={darkMode}
            compact={!isDesktop}
          />
        )}
      </Box>

      {viewMode === 'tier' ? (
        <TierView
          playerTiers={filteredTiers}
          isDesktop={isDesktop}
          areOddsAvailable={areOddsAvailable}
        />
      ) : (
        <NameView
          players={filteredByName}
          isDesktop={isDesktop}
          areOddsAvailable={areOddsAvailable}
        />
      )}
    </Box>
  );
}

interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  darkMode: boolean;
  compact?: boolean;
}

function ViewToggle({ activeView, onViewChange, darkMode, compact }: ViewToggleProps) {
  const activeBg = darkMode ? '#2b62c8' : 'brand';
  const activeBorder = darkMode ? '#8eb3ff' : '#273344';
  const inactiveText = darkMode ? 'light-3' : 'text-weak';

  const tabs: { key: ViewMode; label: string }[] = [
    { key: 'tier', label: 'By Tier' },
    { key: 'name', label: 'By Name' },
  ];

  return (
    <Box
      direction="row"
      round="small"
      border={{ size: 'xsmall', color: 'border' }}
      background="background-front"
      overflow="hidden"
      flex={false}
    >
      {tabs.map((tab) => {
        const isActive = activeView === tab.key;
        return (
          <Button key={tab.key} plain onClick={() => onViewChange(tab.key)}>
            <Box
              pad={{ vertical: 'xsmall', horizontal: compact ? 'small' : 'medium' }}
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
              </Text>
            </Box>
          </Button>
        );
      })}
    </Box>
  );
}

function parseOddsToNumber(odds: string | null | undefined): number {
  if (!odds) return Infinity;
  const cleaned = odds.replace(/[^0-9+-]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? Infinity : num;
}

function sortPlayers(
  players: PoolTournamentPlayer[],
  areOddsAvailable: boolean
): PoolTournamentPlayer[] {
  return [...players].sort((a, b) => {
    if (areOddsAvailable) {
      const oddsA = parseOddsToNumber(a.odds);
      const oddsB = parseOddsToNumber(b.odds);
      if (oddsA !== oddsB) return oddsA - oddsB;
    }
    return a.pga_tournament_player.pga_player.first_name.localeCompare(
      b.pga_tournament_player.pga_player.first_name
    );
  });
}

interface TierViewProps {
  playerTiers: { [key: string]: PoolTournamentPlayer[] };
  isDesktop: boolean;
  areOddsAvailable: boolean;
}

function TierView({ playerTiers, isDesktop, areOddsAvailable }: TierViewProps) {
  return (
    <Box gap="medium">
      {Object.entries(playerTiers).map(([tier, players]) => {
        const sorted = sortPlayers(players, areOddsAvailable);
        return (
          <Box key={tier} gap="small">
            <Heading level={3} margin="none">
              {`Tier ${tier === '0' ? '\uD83D\uDC2F' : tier}`}
            </Heading>
            {sorted.length === 0 ? (
              <Box pad={{ vertical: 'small', horizontal: 'small' }}>
                <Text size="small" color="text-weak">
                  No matching players in this tier.
                </Text>
              </Box>
            ) : (
              <Grid columns={{ count: isDesktop ? 2 : 1, size: 'auto' }} gap="xsmall">
                {sorted.map((p) => (
                  <PlayerEntry
                    key={p.id}
                    player={p}
                    showOdds={areOddsAvailable}
                    isDesktop={isDesktop}
                  />
                ))}
              </Grid>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

interface NameViewProps {
  players: PoolTournamentPlayer[];
  isDesktop: boolean;
  areOddsAvailable: boolean;
}

function NameView({ players, isDesktop, areOddsAvailable }: NameViewProps) {
  const sorted = useMemo(
    () =>
      [...players].sort((a, b) =>
        a.pga_tournament_player.pga_player.first_name.localeCompare(
          b.pga_tournament_player.pga_player.first_name
        )
      ),
    [players]
  );

  if (sorted.length === 0) {
    return (
      <Box pad="medium" align="center">
        <Text size="small" color="text-weak">
          No players found.
        </Text>
      </Box>
    );
  }

  return (
    <Grid columns={{ count: isDesktop ? 2 : 1, size: 'auto' }} gap="xsmall">
      {sorted.map((p) => (
        <PlayerEntry
          key={p.id}
          player={p}
          showTier
          showOdds={areOddsAvailable}
          isDesktop={isDesktop}
        />
      ))}
    </Grid>
  );
}

interface PlayerEntryProps {
  player: PoolTournamentPlayer;
  showTier?: boolean;
  showOdds?: boolean;
  isDesktop?: boolean;
}

function PlayerEntry({ player, showTier, showOdds, isDesktop }: PlayerEntryProps) {
  const pgaPlayer = player.pga_tournament_player.pga_player;
  const odds = player.odds;

  return (
    <Box
      direction="row"
      align="center"
      gap="small"
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      round="xsmall"
    >
      {pgaPlayer.headshot_url ? (
        <Box
          flex={false}
          width="40px"
          height="40px"
          round="full"
          overflow="hidden"
          style={{ flexShrink: 0 }}
        >
          <img
            src={getOptimizedHeadshotUrl(pgaPlayer.headshot_url, 40)}
            alt=""
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
          />
        </Box>
      ) : (
        <Box
          flex={false}
          width="40px"
          height="40px"
          round="full"
          background="light-4"
          align="center"
          justify="center"
          style={{ flexShrink: 0 }}
        >
          <UserIcon size="small" />
        </Box>
      )}

      {pgaPlayer.country_flag_url && (
        <Box flex={false} style={{ flexShrink: 0, marginRight: isDesktop ? '-4px' : undefined }}>
          <img
            src={pgaPlayer.country_flag_url}
            alt={pgaPlayer.country ?? ''}
            style={{ width: '15px', height: 'auto' }}
          />
        </Box>
      )}

      <Box direction="row" align="center" gap="xsmall" style={{ minWidth: 0 }}>
        <Text size="small" weight={500}>
          <Text
            size="small"
            weight={500}
            style={
              player.pga_tournament_player.withdrawn
                ? { textDecoration: 'line-through' }
                : undefined
            }
          >
            {pgaPlayer.first_name} {pgaPlayer.last_name}
          </Text>
          {player.pga_tournament_player.withdrawn && (
            <Text size="xsmall" margin={{ left: 'xxsmall' }} color="#FF003F">
              WD
            </Text>
          )}
        </Text>
        {showOdds && odds && (
          <Box
            round="large"
            pad={{ horizontal: 'xsmall', vertical: '1px' }}
            flex={false}
            style={{
              backgroundColor: 'var(--color-status-upcoming-bg)',
              border: '1px solid var(--color-tab-border)',
            }}
          >
            <Text size="xsmall" weight="bold" style={{ lineHeight: 1.3 }}>
              {odds}
            </Text>
          </Box>
        )}
      </Box>

      {showTier && (
        <Box
          flex={false}
          pad={{ horizontal: 'xsmall', vertical: 'xxsmall' }}
          round="xsmall"
          border={{ size: 'xsmall', color: 'border' }}
          background="background-front"
          style={{ marginLeft: 'auto' }}
        >
          <Text size="xsmall" weight="bold">
            T{player.tier}
          </Text>
        </Box>
      )}
    </Box>
  );
}
