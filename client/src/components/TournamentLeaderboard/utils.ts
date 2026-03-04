import { teeTimeToDate } from './PoolUserPanel/getRoundStatus';

import {
  PgaTournament,
  PgaTournamentPlayer,
  PgaTournamentPlayerStatusEnum as PlayerStatus,
} from '@drewkimberly/pga-pool-api';

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

export function getScoreColor(score: number | string | null | undefined): string {
  const numScore = Number(score);

  if (isNaN(numScore)) {
    return 'inherit';
  }

  if (numScore < 0) {
    return 'var(--color-birdie)';
  }

  if (numScore === 0) {
    return 'var(--color-even)';
  }

  return 'var(--color-bogey)';
}

export function isCutOrWithdrawn(player: PgaTournamentPlayer): boolean {
  return (
    player.withdrawn ||
    player.current_position === 'CUT' ||
    player.status === PlayerStatus.Cut ||
    player.status === PlayerStatus.Wd
  );
}

export function getPlayerInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getPickStatusLabel(player: PgaTournamentPlayer, timezone: string): string | null {
  if (isCutOrWithdrawn(player)) return null;

  if (player.is_round_complete) return 'Round Complete \u2713';

  if (player.active && (player.score_thru ?? 0) > 0) {
    return `Thru ${player.score_thru}`;
  }

  if (player.tee_time) {
    const parsed = teeTimeToDate(player.tee_time, timezone);
    if (parsed) {
      const duration = parsed.diffNow().rescale();
      if (duration.minutes <= 0 && duration.hours <= 0) {
        return 'Starting Soon';
      }
      let output = `${Math.abs(Math.round(duration.minutes))}m`;
      if (Math.abs(duration.hours) > 0) {
        output = `${Math.abs(Math.round(duration.hours))}h ${output}`;
      }
      return `Starts in ${output}`;
    }
  }

  return 'Not Started';
}

export function buildPickMetadata(opts: {
  player: PgaTournamentPlayer;
  tier: number;
  odds: string | null;
  timezone: string;
  isStrokesPool: boolean;
  isCutOrWithdrawn: boolean;
}): string[] {
  const { player, tier, odds, timezone, isStrokesPool, isCutOrWithdrawn: isCut } = opts;
  const parts: string[] = [];

  if (!isCut && player.current_position) {
    parts.push(`Pos ${player.current_position}`);
  }

  if (!isStrokesPool && !isCut) {
    parts.push(`To Par ${toScoreString(player.score_total)}`);
  }

  if (!isCut) {
    const statusLabel = getPickStatusLabel(player, timezone);
    if (statusLabel) parts.push(statusLabel);
  }

  parts.push(`Tier ${tier}`);

  if (odds) {
    parts.push(`Odds ${odds}`);
  }

  return parts;
}
