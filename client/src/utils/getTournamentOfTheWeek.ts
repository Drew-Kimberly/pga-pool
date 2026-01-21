import { PgaTournament } from '@drewkimberly/pga-pool-api';

/**
 * Gets the week boundary date (Sunday at 2AM EST).
 *
 * @param date - Reference date
 * @param type - 'start' for most recent Sunday 2AM EST, 'end' for next Sunday 2AM EST
 * @returns Date representing the week boundary in UTC
 */
function getWeekBoundary(date: Date, type: 'start' | 'end'): Date {
  // Create a date in EST/EDT timezone
  const estFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = estFormatter.formatToParts(date);
  const getPart = (partType: string) => parts.find((p) => p.type === partType)?.value ?? '';

  const estYear = parseInt(getPart('year'), 10);
  const estMonth = parseInt(getPart('month'), 10) - 1; // 0-indexed
  const estDay = parseInt(getPart('day'), 10);
  const estHour = parseInt(getPart('hour'), 10);

  // Create a Date object representing the EST date/time
  // We'll work with this to find Sunday 2AM
  const estDate = new Date(estYear, estMonth, estDay, estHour);
  const dayOfWeek = estDate.getDay(); // 0 = Sunday

  // Calculate days to adjust
  let daysToAdjust: number;

  if (type === 'start') {
    // Go back to most recent Sunday
    daysToAdjust = -dayOfWeek;
    // If we're on Sunday but before 2AM EST, go back another week
    if (dayOfWeek === 0 && estHour < 2) {
      daysToAdjust = -7;
    }
  } else {
    // Go forward to next Sunday
    daysToAdjust = 7 - dayOfWeek;
    // If we're on Sunday and at or after 2AM EST, go to next Sunday
    if (dayOfWeek === 0 && estHour >= 2) {
      daysToAdjust = 7;
    }
  }

  // Create the boundary date at 2AM EST
  const boundaryEst = new Date(estYear, estMonth, estDay + daysToAdjust, 2, 0, 0, 0);

  // Get the offset for the boundary date in EST to determine if DST is active
  const testDate = new Date(
    Date.UTC(
      boundaryEst.getFullYear(),
      boundaryEst.getMonth(),
      boundaryEst.getDate(),
      7, // 2AM EST = 7AM UTC (standard time)
      0,
      0,
      0
    )
  );

  // Check if this date is in DST by comparing formatter output
  const checkFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    hour12: false,
  });

  // Try 7AM UTC (2AM EST standard) and 6AM UTC (2AM EDT)
  const hourAt7UTC = parseInt(
    checkFormatter.formatToParts(testDate).find((p) => p.type === 'hour')?.value ?? '0',
    10
  );

  // If hour at 7AM UTC shows 2AM in EST, we're in standard time
  // If hour at 7AM UTC shows 3AM in EST, we're in daylight time
  const isDST = hourAt7UTC === 3;

  // Create the final UTC date
  // 2AM EST = 7AM UTC (standard) or 6AM UTC (daylight)
  const utcHour = isDST ? 6 : 7;

  return new Date(
    Date.UTC(
      boundaryEst.getFullYear(),
      boundaryEst.getMonth(),
      boundaryEst.getDate(),
      utcHour,
      0,
      0,
      0
    )
  );
}

/**
 * Finds the tournament of the week from an array of tournaments.
 *
 * The "tournament of the week" is the tournament whose start_date falls within
 * the current calendar week, where weeks are defined as Sunday 2AM EST to
 * the following Sunday 2AM EST.
 *
 * @param tournaments - Array of PgaTournament objects from API response
 * @returns The tournament for this week, or undefined if none found
 */
export function getTournamentOfTheWeek(tournaments: PgaTournament[]): PgaTournament | undefined {
  const now = new Date();
  const weekStart = getWeekBoundary(now, 'start');
  const weekEnd = getWeekBoundary(now, 'end');

  return tournaments
    .filter((t) => {
      const startDate = new Date(t.date.start);
      return startDate >= weekStart && startDate <= weekEnd;
    })
    .sort((a, b) => new Date(a.date.start).getTime() - new Date(b.date.start).getTime())[0];
}
