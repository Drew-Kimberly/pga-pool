import { Box, Text } from 'grommet';
import { CSSProperties } from 'react';

import { Spinner } from '../../Spinner';

import { Scorecard, ScorecardHole, ScorecardHoleStatusEnum } from '@drewkimberly/pga-pool-api';

function getHoleScoreColor(status: ScorecardHoleStatusEnum): string | undefined {
  switch (status) {
    case ScorecardHoleStatusEnum.Eagle:
      return 'var(--color-eagle)';
    case ScorecardHoleStatusEnum.Birdie:
      return 'var(--color-birdie)';
    case ScorecardHoleStatusEnum.Bogey:
      return 'var(--color-bogey)';
    case ScorecardHoleStatusEnum.DoubleBogey:
      return 'var(--color-double-bogey)';
    default:
      return undefined;
  }
}

function getHoleScoreBg(status: ScorecardHoleStatusEnum): string | undefined {
  switch (status) {
    case ScorecardHoleStatusEnum.Eagle:
      return 'rgba(212, 160, 23, 0.12)';
    case ScorecardHoleStatusEnum.Birdie:
      return 'rgba(185, 28, 28, 0.08)';
    case ScorecardHoleStatusEnum.Bogey:
      return 'rgba(37, 99, 235, 0.08)';
    case ScorecardHoleStatusEnum.DoubleBogey:
      return 'rgba(29, 78, 216, 0.12)';
    default:
      return undefined;
  }
}

const cellStyle: CSSProperties = {
  textAlign: 'center',
  minWidth: 24,
  padding: '4px 2px',
};

const headerCellStyle: CSSProperties = {
  ...cellStyle,
  backgroundColor: 'var(--color-scorecard-header)',
};

const labelStyle: CSSProperties = {
  ...cellStyle,
  minWidth: 32,
  fontWeight: 700,
  textAlign: 'left',
  paddingLeft: 6,
};

function NineHoleGrid({
  holes,
  label,
  totalPar,
  totalStrokes,
}: {
  holes: ScorecardHole[];
  label: string;
  totalPar: number;
  totalStrokes: number;
}) {
  return (
    <Box style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={labelStyle}>
              <Text size="xsmall" weight="bold">
                HOLE
              </Text>
            </th>
            {holes.map((h) => (
              <th key={h.hole_number} style={headerCellStyle}>
                <Text size="xsmall" color="text-weak">
                  {h.hole_number}
                </Text>
              </th>
            ))}
            <th style={headerCellStyle}>
              <Text size="xsmall" weight="bold">
                {label}
              </Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Par row */}
          <tr>
            <td style={labelStyle}>
              <Text size="xsmall" color="text-weak">
                PAR
              </Text>
            </td>
            {holes.map((h) => (
              <td key={h.hole_number} style={cellStyle}>
                <Text size="xsmall" color="text-weak">
                  {h.par}
                </Text>
              </td>
            ))}
            <td style={cellStyle}>
              <Text size="xsmall" color="text-weak" weight="bold">
                {totalPar}
              </Text>
            </td>
          </tr>
          {/* Score row */}
          <tr>
            <td style={labelStyle}>
              <Text size="xsmall" weight="bold">
                SCR
              </Text>
            </td>
            {holes.map((h) => {
              const color = getHoleScoreColor(h.status);
              const bg = getHoleScoreBg(h.status);
              return (
                <td
                  key={h.hole_number}
                  style={{
                    ...cellStyle,
                    backgroundColor: bg,
                    borderRadius: bg ? 4 : undefined,
                  }}
                >
                  <Text size="xsmall" weight="bold" color={color}>
                    {h.score}
                  </Text>
                </td>
              );
            })}
            <td style={cellStyle}>
              <Text size="xsmall" weight="bold" style={{ fontFamily: 'var(--font-display)' }}>
                {totalStrokes}
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
    </Box>
  );
}

export interface PlayerPanelScorecardProps {
  scorecard: Scorecard | null;
  isLoading: boolean;
  error: string | null;
}

export function PlayerPanelScorecard({ scorecard, isLoading, error }: PlayerPanelScorecardProps) {
  if (isLoading) {
    return (
      <Box align="center" pad="small">
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box align="center" pad="small">
        <Text size="small" color="text-weak">
          {error}
        </Text>
      </Box>
    );
  }

  if (!scorecard || scorecard.holes.length === 0) {
    return (
      <Box align="center" pad="small">
        <Text size="small" color="text-weak">
          No scorecard data available
        </Text>
      </Box>
    );
  }

  const sorted = [...scorecard.holes].sort((a, b) => a.hole_number - b.hole_number);
  const front9 = sorted.filter((h) => h.hole_number <= 9);
  const back9 = sorted.filter((h) => h.hole_number > 9);

  const front9Par = front9.reduce((sum, h) => sum + h.par, 0);
  const front9Strokes = front9.reduce((sum, h) => sum + h.score, 0);
  const back9Par = back9.reduce((sum, h) => sum + h.par, 0);
  const back9Strokes = back9.reduce((sum, h) => sum + h.score, 0);

  return (
    <Box gap="small">
      {front9.length > 0 && (
        <NineHoleGrid
          holes={front9}
          label="OUT"
          totalPar={front9Par}
          totalStrokes={front9Strokes}
        />
      )}
      {back9.length > 0 && (
        <NineHoleGrid holes={back9} label="IN" totalPar={back9Par} totalStrokes={back9Strokes} />
      )}
      {front9.length > 0 && back9.length > 0 && (
        <Box direction="row" justify="end" pad={{ horizontal: 'small' }}>
          <Text size="small" weight="bold" style={{ fontFamily: 'var(--font-display)' }}>
            Total: {scorecard.strokes} (
            {scorecard.to_par === 0
              ? 'E'
              : scorecard.to_par > 0
                ? `+${scorecard.to_par}`
                : scorecard.to_par}
            )
          </Text>
        </Box>
      )}
    </Box>
  );
}
