import { CSSProperties, useMemo, useState } from 'react';

import { getOptimizedHeadshotUrl } from '../../cloudinary';

import { getPlayerInitials, getScoreColor, toScoreString } from './utils';

export interface ScoreBadgeData {
  /** Total score (to par). Used for display and color. */
  score: number | null | undefined;
  /** Whether the player is CUT */
  isCut?: boolean;
  /** Whether the player is withdrawn */
  isWithdrawn?: boolean;
  /** Whether the player has started playing (has teed off) */
  hasStarted?: boolean;
}

export interface PlayerHeadshotProps {
  src: string | null | undefined;
  name: string;
  size?: number;
  badge?: ScoreBadgeData;
}

function ScoreBadge({ badge, headshotSize }: { badge: ScoreBadgeData; headshotSize: number }) {
  const { score, isCut, isWithdrawn, hasStarted } = badge;

  // Don't show badge if player hasn't teed off and has no score
  if (!hasStarted && !isCut && !isWithdrawn) return null;

  let label: string;
  let bg: string;
  let color: string;

  if (isCut) {
    label = 'C';
    bg = 'var(--color-status-cut)';
    color = '#fff';
  } else if (isWithdrawn) {
    label = 'WD';
    bg = 'var(--color-status-cut)';
    color = '#fff';
  } else {
    label = toScoreString(score);
    const scoreColor = getScoreColor(score);
    const isUnderPar = Number(score) < 0;
    const isOverPar = Number(score) > 0;

    if (isUnderPar) {
      bg = scoreColor;
      color = '#fff';
    } else if (isOverPar) {
      bg = scoreColor;
      color = '#fff';
    } else {
      // Even par — neutral
      bg = 'var(--color-even)';
      color = '#fff';
    }
  }

  // Badge size scales with headshot — ~40% of headshot diameter
  const badgeSize = Math.max(16, Math.round(headshotSize * 0.42));
  const fontSize = Math.max(8, Math.round(badgeSize * 0.52));

  const style: CSSProperties = {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: badgeSize,
    height: badgeSize,
    borderRadius: '50%',
    backgroundColor: bg,
    color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize,
    fontWeight: 700,
    lineHeight: 1,
    border: '2px solid var(--color-headshot-badge-border, #fff)',
    boxSizing: 'border-box',
    letterSpacing: '-0.02em',
  };

  return <div style={style}>{label}</div>;
}

export function PlayerHeadshot({ src, name, size = 28, badge }: PlayerHeadshotProps) {
  const [imgError, setImgError] = useState(false);
  const initials = getPlayerInitials(name);
  const optimizedSrc = useMemo(
    () => (src ? getOptimizedHeadshotUrl(src, size) : null),
    [src, size]
  );
  const showFallback = !optimizedSrc || imgError;
  const isFaded = badge?.isCut || badge?.isWithdrawn;

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    width: size,
    height: size,
    minWidth: size,
    flexShrink: 0,
  };

  const containerStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: showFallback ? '#9ca3af' : undefined,
    boxSizing: 'border-box',
    opacity: isFaded ? 0.5 : 1,
  };

  if (showFallback) {
    return (
      <div style={wrapperStyle} title={name}>
        <div style={containerStyle}>
          <span
            style={{
              color: '#fff',
              fontSize: size * 0.38,
              fontWeight: 600,
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            {initials}
          </span>
        </div>
        {badge && <ScoreBadge badge={badge} headshotSize={size} />}
      </div>
    );
  }

  return (
    <div style={wrapperStyle} title={name}>
      <div style={containerStyle}>
        <img
          src={optimizedSrc!}
          alt={name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {badge && <ScoreBadge badge={badge} headshotSize={size} />}
    </div>
  );
}
