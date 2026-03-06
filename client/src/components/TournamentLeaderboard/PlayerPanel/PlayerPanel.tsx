import { Box, Text } from 'grommet';
import { FormClose } from 'grommet-icons';
import { CSSProperties, useCallback, useEffect, useState } from 'react';

import { PlayerHeadshot } from '../PlayerHeadshot';
import { getScoreColor, isCutOrWithdrawn, toScoreString } from '../utils';

import { PlayerPanelScorecard } from './PlayerPanelScorecard';
import { useScorecard } from './useScorecard';

import {
  PgaTournamentPlayer,
  PoolTournamentUserPick,
  RoundSummary,
} from '@drewkimberly/pga-pool-api';

export interface PlayerPanelProps {
  pick: PoolTournamentUserPick;
  onClose: () => void;
}

function RoundTab({
  roundNumber,
  roundSummary,
  isActive,
  onClick,
}: {
  roundNumber: number;
  roundSummary: RoundSummary | undefined;
  isActive: boolean;
  onClick: () => void;
}) {
  const hasSummary = !!roundSummary;
  const toPar = roundSummary?.to_par;
  const scoreColor = hasSummary ? getScoreColor(toPar) : undefined;

  return (
    <Box
      onClick={hasSummary ? onClick : undefined}
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      round="small"
      align="center"
      style={{
        cursor: hasSummary ? 'pointer' : 'default',
        opacity: hasSummary ? 1 : 0.35,
        backgroundColor: isActive ? 'var(--color-scorecard-header)' : undefined,
        transition: 'background-color 0.15s ease',
        minWidth: 56,
      }}
    >
      <Text size="xsmall" color="text-weak" style={{ textTransform: 'uppercase' }}>
        R{roundNumber}
      </Text>
      {hasSummary ? (
        <Text weight="bold" color={scoreColor} style={{ fontFamily: 'var(--font-display)' }}>
          {roundSummary.strokes}
        </Text>
      ) : (
        <Text color="text-weak">--</Text>
      )}
      {hasSummary && (
        <Text size="xsmall" color={scoreColor}>
          {toScoreString(toPar)}
        </Text>
      )}
    </Box>
  );
}

function getLatestRound(player: PgaTournamentPlayer): number {
  const rounds = player.rounds ?? [];
  if (rounds.length === 0) return player.current_round ?? 1;
  return Math.max(...rounds.map((r) => r.round_number));
}

export function PlayerPanel({ pick, onClose }: PlayerPanelProps) {
  const player = pick.pga_tournament_player;
  const pgaPlayer = player.pga_player;
  const isCut = isCutOrWithdrawn(player);
  const rounds: RoundSummary[] = player.rounds ?? [];

  const [selectedRound, setSelectedRound] = useState<number>(() => getLatestRound(player));
  const [isVisible, setIsVisible] = useState(false);

  const {
    data: scorecard,
    isLoading: scorecardLoading,
    error: scorecardError,
  } = useScorecard(player.id, selectedRound);

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  const scoreColor = getScoreColor(player.score_total);
  const odds = pick.odds;

  const roundsMap = new Map<number, RoundSummary>();
  for (const r of rounds) {
    roundsMap.set(r.round_number, r);
  }

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    backgroundColor: 'var(--color-panel-backdrop)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.25s ease',
  };

  const panelStyle: CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
    maxHeight: '85vh',
    overflowY: 'auto',
    backgroundColor: 'var(--color-panel-bg)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.15)',
    transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
  };

  return (
    <>
      {/* Backdrop */}
      <div style={backdropStyle} onClick={handleClose} role="presentation" />

      {/* Panel */}
      <div style={panelStyle} role="dialog" aria-label={`${pgaPlayer.name} details`}>
        {/* Drag handle */}
        <Box align="center" pad={{ top: 'small', bottom: 'xsmall' }}>
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'var(--color-panel-handle)',
            }}
          />
        </Box>

        {/* Close button */}
        <Box
          style={{ position: 'absolute', top: 12, right: 12, cursor: 'pointer' }}
          onClick={handleClose}
          aria-label="Close"
        >
          <FormClose size="medium" color="text-weak" />
        </Box>

        {/* Header: Headshot + Name + Position */}
        <Box pad={{ horizontal: 'medium', bottom: 'small' }} gap="small">
          <Box direction="row" align="center" gap="medium">
            <PlayerHeadshot src={pgaPlayer.headshot_url} name={pgaPlayer.name} size={64} />
            <Box flex>
              <Text
                weight="bold"
                size="large"
                style={{ fontFamily: 'var(--font-display)', lineHeight: 1.2 }}
              >
                {pgaPlayer.name}
              </Text>
              <Box direction="row" align="center" gap="xsmall">
                {pgaPlayer.country_flag && <Text size="small">{pgaPlayer.country_flag}</Text>}
                {pgaPlayer.country && (
                  <Text size="small" color="text-weak">
                    {pgaPlayer.country}
                  </Text>
                )}
              </Box>
            </Box>
          </Box>

          {/* Scoring strip */}
          <Box
            direction="row"
            gap="medium"
            pad={{ vertical: 'small', horizontal: 'small' }}
            round="small"
            style={{
              backgroundColor: 'var(--color-scorecard-header)',
              opacity: isCut ? 0.5 : 1,
            }}
          >
            {/* Position */}
            <Box align="center">
              <Text size="xsmall" color="text-weak" style={{ textTransform: 'uppercase' }}>
                Pos
              </Text>
              <Text
                weight="bold"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)' }}
              >
                {player.current_position ?? '--'}
              </Text>
            </Box>
            {/* Total */}
            <Box align="center">
              <Text size="xsmall" color="text-weak" style={{ textTransform: 'uppercase' }}>
                Total
              </Text>
              <Text
                weight="bold"
                color={scoreColor}
                style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)' }}
              >
                {toScoreString(player.score_total)}
              </Text>
            </Box>
            {/* Thru */}
            <Box align="center">
              <Text size="xsmall" color="text-weak" style={{ textTransform: 'uppercase' }}>
                Thru
              </Text>
              <Text
                weight="bold"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)' }}
              >
                {player.is_round_complete ? 'F' : (player.score_thru ?? '--')}
              </Text>
            </Box>
            {/* Odds */}
            {odds && (
              <Box align="center">
                <Text size="xsmall" color="text-weak" style={{ textTransform: 'uppercase' }}>
                  Odds
                </Text>
                <Text
                  weight="bold"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)' }}
                >
                  {odds}
                </Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Round scores tabs */}
        <Box pad={{ horizontal: 'medium' }}>
          <Box direction="row" gap="xsmall" justify="center">
            {[1, 2, 3, 4].map((rn) => (
              <RoundTab
                key={rn}
                roundNumber={rn}
                roundSummary={roundsMap.get(rn)}
                isActive={selectedRound === rn}
                onClick={() => setSelectedRound(rn)}
              />
            ))}
          </Box>
        </Box>

        {/* Scorecard */}
        <Box pad={{ horizontal: 'small', top: 'small', bottom: 'medium' }}>
          <PlayerPanelScorecard
            scorecard={scorecard}
            isLoading={scorecardLoading}
            error={scorecardError}
          />
        </Box>
      </div>
    </>
  );
}
