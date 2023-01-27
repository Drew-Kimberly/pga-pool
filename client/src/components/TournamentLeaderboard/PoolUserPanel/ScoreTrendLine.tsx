import { ResponsiveContext } from 'grommet';
import React from 'react';
import { Line, LineChart } from 'recharts';

export interface ScoreTrendLineProps {
  /**
   * Sorted ASC by timestamp, i.e. scores[scores.length - 1] is the most recent score.
   */
  scores: number[];
}

export function ScoreTrendLine({ scores }: ScoreTrendLineProps) {
  const size = React.useContext(ResponsiveContext);
  const computed = React.useCallback(() => {
    scores = scores.slice(scores.length > 10 ? scores.length - 10 : 0, scores.length);
    const trend = computeScoreTrend(scores);

    let color: string;
    if (trend > 0) {
      color = '#FF003F';
    } else if (trend < 0) {
      color = '#32de84';
    } else {
      color = '#8884d8';
    }

    return { data: scores.map((s) => ({ val: s })), color };
  }, [scores]);

  if (scores.length <= 1) {
    return null;
  }

  const { data, color } = computed();

  return (
    <LineChart
      width={size === 'small' ? 60 : 100}
      height={data.length >= 5 ? 40 : 15 + Math.pow(data.length, 2)}
      data={data}
    >
      <Line
        dataKey="val"
        type="monotone"
        stroke={color}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  );
}

function computeScoreTrend(scores: number[]): number {
  let i = 1;
  let lastValue = scores[0];
  let trend = 0;
  while (typeof lastValue === 'number') {
    const currValue = scores[i];
    if (typeof currValue === 'number') {
      trend += currValue - lastValue;
    }

    lastValue = currValue;
    i++;
  }

  return trend;
}
