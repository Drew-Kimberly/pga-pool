import FocusTrap from 'focus-trap-react';
import { Box, Text } from 'grommet';
import { FormClose } from 'grommet-icons';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

import { PlayerHeadshot } from '../PlayerHeadshot';
import { getScoreColor, isCutOrWithdrawn, toScoreString } from '../utils';

import { PlayerPanelScorecard } from './PlayerPanelScorecard';
import { useScorecard } from './useScorecard';

import {
  PgaTournamentPlayer,
  PoolTournamentUserPick,
  RoundSummary,
} from '@drewkimberly/pga-pool-api';

const DESKTOP_BREAKPOINT = 768;
const PANEL_WIDTH = 420;
const DRAG_DISMISS_THRESHOLD = 100;
const ANIMATION_DURATION = 300;

export interface PlayerPanelProps {
  pick: PoolTournamentUserPick;
  onClose: () => void;
  isCompleted?: boolean;
  fedexCupPoints?: string;
}

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isDesktop;
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
    <button
      onClick={hasSummary ? onClick : undefined}
      disabled={!hasSummary}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: 6,
        border: 'none',
        background: isActive ? 'var(--color-scorecard-header)' : 'transparent',
        color: 'inherit',
        cursor: hasSummary ? 'pointer' : 'default',
        opacity: hasSummary ? 1 : 0.35,
        transition: 'background-color 0.15s ease',
        minWidth: 56,
      }}
    >
      <Text size="xsmall" color="text-weak" style={{ textTransform: 'uppercase' }}>
        R{roundNumber}
      </Text>
      {hasSummary ? (
        <Text weight="bold" style={{ fontFamily: 'var(--font-display)' }}>
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
    </button>
  );
}

function getLatestRound(player: PgaTournamentPlayer): number {
  const rounds = player.rounds ?? [];
  if (rounds.length === 0) return player.current_round ?? 1;
  return Math.max(...rounds.map((r) => r.round_number));
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box align="center" flex>
      <Text size="xsmall" color="text-weak" style={{ textTransform: 'uppercase' }}>
        {label}
      </Text>
      <Text
        weight="bold"
        color={color}
        style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)' }}
      >
        {value}
      </Text>
    </Box>
  );
}

export function PlayerPanel({
  pick,
  onClose,
  isCompleted = false,
  fedexCupPoints,
}: PlayerPanelProps) {
  const player = pick.pga_tournament_player;
  const pgaPlayer = player.pga_player;
  const isCut = isCutOrWithdrawn(player);
  const rounds: RoundSummary[] = player.rounds ?? [];
  const isDesktop = useIsDesktop();

  const [selectedRound, setSelectedRound] = useState<number>(() => getLatestRound(player));
  const [isVisible, setIsVisible] = useState(false);

  // Drag-to-dismiss state (mobile only)
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    data: scorecard,
    isLoading: scorecardLoading,
    error: scorecardError,
  } = useScorecard(player.id, selectedRound);

  // Animate in on mount + lock body scroll
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, ANIMATION_DURATION);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  // Drag-to-dismiss handlers (mobile bottom sheet only)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isDesktop) return;
      // Only start drag from the header area (not scrollable scorecard content)
      const panel = panelRef.current;
      if (panel && panel.scrollTop > 0) return;
      dragStartY.current = e.touches[0].clientY;
      setIsDragging(true);
    },
    [isDesktop]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || isDesktop) return;
      const deltaY = e.touches[0].clientY - dragStartY.current;
      if (deltaY > 0) {
        setDragY(deltaY);
      }
    },
    [isDragging, isDesktop]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > DRAG_DISMISS_THRESHOLD) {
      handleClose();
    } else {
      setDragY(0);
    }
  }, [isDragging, dragY, handleClose]);

  const odds = pick.odds;

  const roundsMap = new Map<number, RoundSummary>();
  for (const r of rounds) {
    roundsMap.set(r.round_number, r);
  }

  // Today's round score (for live view)
  const todayRound = roundsMap.get(player.current_round ?? 0);

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

  // Desktop: right-side slide-over. Mobile: bottom sheet.
  const panelTransform = isDesktop
    ? isVisible
      ? 'translateX(0)'
      : 'translateX(100%)'
    : isDragging
      ? `translateY(${dragY}px)`
      : isVisible
        ? 'translateY(0)'
        : 'translateY(100%)';

  const panelStyle: CSSProperties = isDesktop
    ? {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: PANEL_WIDTH,
        zIndex: 1001,
        overflowY: 'auto',
        backgroundColor: 'var(--color-panel-bg)',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
        transform: panelTransform,
        transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        willChange: 'transform',
      }
    : {
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
        transform: panelTransform,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        willChange: 'transform',
      };

  return (
    <FocusTrap focusTrapOptions={{ allowOutsideClick: true, escapeDeactivates: false }}>
      <div>
        {/* Backdrop */}
        <div style={backdropStyle} onClick={handleClose} role="presentation" />

        {/* Panel */}
        <div
          ref={panelRef}
          style={panelStyle}
          role="dialog"
          aria-modal="true"
          aria-label={`${pgaPlayer.name} details`}
          onTouchStart={!isDesktop ? handleTouchStart : undefined}
          onTouchMove={!isDesktop ? handleTouchMove : undefined}
          onTouchEnd={!isDesktop ? handleTouchEnd : undefined}
        >
          {/* Drag handle (mobile only) */}
          {!isDesktop && (
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
          )}

          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 6,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease',
            }}
            className="panel-close-btn"
          >
            <FormClose size="medium" color="text-weak" />
          </button>

          {/* Header: Headshot + Name + Country */}
          <Box
            pad={{ horizontal: 'medium', top: isDesktop ? 'medium' : undefined, bottom: 'small' }}
            gap="small"
          >
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
                  {pgaPlayer.country_flag_url && (
                    <img
                      src={pgaPlayer.country_flag_url}
                      alt={pgaPlayer.country ?? ''}
                      style={{ width: 16, height: 12 }}
                    />
                  )}
                  {pgaPlayer.country && (
                    <Text size="small" color="text-weak">
                      {pgaPlayer.country}
                    </Text>
                  )}
                </Box>
                {odds && (
                  <Box direction="row" align="center" margin={{ top: '2px' }}>
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
                  </Box>
                )}
              </Box>
            </Box>

            {/* Scoring strip */}
            <Box
              direction="row"
              pad={{ vertical: 'small', horizontal: 'small' }}
              round="small"
              style={{
                backgroundColor: 'var(--color-scorecard-header)',
                opacity: isCut ? 0.5 : 1,
              }}
            >
              <StatBox label="Pos" value={player.current_position ?? '--'} />
              <StatBox label="Total" value={toScoreString(player.score_total)} />
              {!isCompleted && todayRound && (
                <StatBox label="Today" value={toScoreString(todayRound.to_par)} />
              )}
              {!isCompleted && (
                <StatBox
                  label="Thru"
                  value={player.is_round_complete ? 'F' : (player.score_thru ?? '--')}
                />
              )}
              {isCompleted && fedexCupPoints && (
                <StatBox label="FedEx Cup" value={fedexCupPoints} />
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
      </div>
    </FocusTrap>
  );
}
