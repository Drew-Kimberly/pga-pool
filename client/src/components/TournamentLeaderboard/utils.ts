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

export interface MetaPair {
  label: string;
  value: string;
}

/**
 * Returns the "Thru" value for a player:
 * "F" (round complete), "15" (active), "Starting Soon", "Starts in 2h 15m", or "--"
 */
export function getThruValue(player: PgaTournamentPlayer, timezone: string): string {
  if (isCutOrWithdrawn(player)) return '--';

  if (player.is_round_complete) return 'F';

  if (player.active && (player.score_thru ?? 0) > 0) {
    return `${player.score_thru}`;
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
      return output;
    }
  }

  return '--';
}

/**
 * Pool-level metadata: tier and odds.
 * Shown next to the player name.
 */
export function buildPoolMeta(opts: { tier: number; odds: string | null }): MetaPair[] {
  const pairs: MetaPair[] = [{ label: 'Tier', value: `${opts.tier}` }];

  if (opts.odds) {
    pairs.push({ label: 'Odds', value: opts.odds });
  }

  return pairs;
}

/**
 * Tournament/score metadata: position, total, thru.
 * Shown below the player name.
 */
export function buildScoreMeta(opts: {
  player: PgaTournamentPlayer;
  timezone: string;
  isStrokesPool: boolean;
  isCutOrWithdrawn: boolean;
}): MetaPair[] {
  const { player, timezone, isStrokesPool, isCutOrWithdrawn: isCut } = opts;
  const pairs: MetaPair[] = [];

  if (!isCut && player.current_position) {
    pairs.push({ label: 'Pos', value: player.current_position });
  }

  if (!isStrokesPool && !isCut) {
    pairs.push({ label: 'Total', value: toScoreString(player.score_total) });
  }

  if (!isCut) {
    const thru = getThruValue(player, timezone);
    if (thru !== '--') {
      pairs.push({ label: 'Thru', value: thru });
    }
  }

  return pairs;
}
