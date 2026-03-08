import { Box, Text } from 'grommet';
import { CSSProperties } from 'react';

import { Spinner } from '../../Spinner';
import { toScoreString } from '../utils';

import { Scorecard, ScorecardHole, ScorecardHoleStatusEnum } from '@drewkimberly/pga-pool-api';

/**
 * Returns CSS for idiomatic golf scorecard symbols:
 * - Birdie: single red circle
 * - Eagle (or better): double red circle
 * - Bogey: single square (default text color)
 * - Double bogey (or worse): double square (default text color)
 *
 * All score numbers remain default text color — only birdie/eagle
 * circles are red, bogey/double-bogey squares are neutral.
 */
function getScoreSymbolStyle(status: ScorecardHoleStatusEnum): CSSProperties | undefined {
  const birdieColor = 'var(--color-birdie)';
  const bogeyColor = 'var(--color-bogey)';

  switch (status) {
    case ScorecardHoleStatusEnum.Birdie:
      return {
        border: `1.5px solid ${birdieColor}`,
        borderRadius: '50%',
        width: 22,
        height: 22,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
    case ScorecardHoleStatusEnum.Eagle:
      return {
        border: `1.5px solid ${birdieColor}`,
        borderRadius: '50%',
        outline: `1.5px solid ${birdieColor}`,
        outlineOffset: 2,
        outlineStyle: 'solid',
        width: 22,
        height: 22,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
    case ScorecardHoleStatusEnum.Bogey:
      return {
        border: `1.5px solid ${bogeyColor}`,
        borderRadius: 2,
        width: 22,
        height: 22,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
    case ScorecardHoleStatusEnum.DoubleBogey:
      return {
        border: `1.5px solid ${bogeyColor}`,
        borderRadius: 2,
        outline: `1.5px solid ${bogeyColor}`,
        outlineOffset: 2,
        outlineStyle: 'solid',
        width: 22,
        height: 22,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
    default:
      return undefined;
  }
}

const cellStyle: CSSProperties = {
  textAlign: 'center',
  padding: '4px 2px',
  verticalAlign: 'middle',
};

const headerCellStyle: CSSProperties = {
  ...cellStyle,
  backgroundColor: 'var(--color-scorecard-header)',
};

const LABEL_WIDTH = 50;

const labelStyle: CSSProperties = {
  ...cellStyle,
  width: LABEL_WIDTH,
  minWidth: LABEL_WIDTH,
  fontWeight: 700,
  textAlign: 'left',
  paddingLeft: 8,
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
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          tableLayout: holes.length < 9 ? 'auto' : 'fixed',
        }}
      >
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
                SCORE
              </Text>
            </td>
            {holes.map((h) => {
              const symbolStyle = getScoreSymbolStyle(h.status);
              return (
                <td key={h.hole_number} style={{ ...cellStyle, padding: '5px 1px' }}>
                  {symbolStyle ? (
                    <span style={symbolStyle}>
                      <Text size="xsmall" weight="bold">
                        {h.score}
                      </Text>
                    </span>
                  ) : (
                    <Text size="xsmall" weight="bold">
                      {h.score}
                    </Text>
                  )}
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

  const toParColor = scorecard.to_par < 0 ? 'var(--color-birdie)' : undefined;

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
            Total: {scorecard.strokes}{' '}
            <span style={{ color: toParColor ?? undefined }}>
              ({toScoreString(scorecard.to_par)})
            </span>
          </Text>
        </Box>
      )}
    </Box>
  );
}
