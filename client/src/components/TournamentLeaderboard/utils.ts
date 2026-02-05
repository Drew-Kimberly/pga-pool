import { DateTime } from 'luxon';

import { PgaTournament, PgaTournamentPlayer } from '@drewkimberly/pga-pool-api';

export function toScoreString(score: number | string | null | undefined): string {
  const numScore = Number(score);

  if (isNaN(numScore)) {
    return '--';
  }

  if (numScore === 0) {
    return 'E';
  }

  if (numScore > 0) {
    return `+${numScore}`;
  }

  return `${numScore}`;
}

export function toFedexCupPointsString(points: number | null | undefined): string {
  const numPoints = Number(points);

  if (isNaN(numPoints)) {
    return '--';
  }

  return `${Math.round(numPoints * 10) / 10}`;
}

export function getEffectiveFedexCupPoints(
  tournament: PgaTournament,
  player: PgaTournamentPlayer
): number | null | undefined {
  return tournament.official_fedex_cup_points_calculated
    ? player.official_fedex_cup_points
    : player.projected_fedex_cup_points;
}

export function formatTeeTimeLocal(teeTime: string, tz: string): string | null {
  const trimmed = teeTime.trim();
  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric) && numeric > 0) {
      const fromEpoch =
        trimmed.length <= 10 ? DateTime.fromSeconds(numeric) : DateTime.fromMillis(numeric);
      if (fromEpoch.isValid) {
        return fromEpoch.toLocal().toLocaleString(DateTime.TIME_SIMPLE);
      }
    }
  }

  const normalizedTeetime =
    (trimmed.endsWith('*')
      ? trimmed.substring(0, trimmed.length - 1).toUpperCase()
      : trimmed.toUpperCase()) +
    ' ' +
    tz;

  const datetime = DateTime.fromFormat(normalizedTeetime, 'h:mma z');
  if (!datetime.isValid) {
    return null;
  }

  return datetime.toLocal().toLocaleString(DateTime.TIME_SIMPLE);
}
