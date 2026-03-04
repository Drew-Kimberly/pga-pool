import { CSSProperties, useState } from 'react';

import { getPlayerInitials } from './utils';

export interface PlayerHeadshotProps {
  src: string | null | undefined;
  name: string;
  size?: number;
  borderColor?: string;
}

export function PlayerHeadshot({ src, name, size = 28, borderColor }: PlayerHeadshotProps) {
  const [imgError, setImgError] = useState(false);
  const initials = getPlayerInitials(name);
  const showFallback = !src || imgError;

  const containerStyle: CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: showFallback ? '#9ca3af' : undefined,
    border: borderColor ? `2px solid ${borderColor}` : undefined,
    boxSizing: 'border-box',
  };

  if (showFallback) {
    return (
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
    );
  }

  return (
    <div style={containerStyle}>
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
