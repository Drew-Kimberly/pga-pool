const CT_TIMEZONE = 'America/Chicago';
const MONDAY = 1;
const GRACE_HOUR = 8; // 8 AM CT

/**
 * Returns true if the current time is before the next Monday at 8:00 AM CT
 * after the tournament's end date. This keeps a completed tournament visible
 * on the Leaderboard nav link through the weekend and into Monday morning.
 *
 * Uses Intl.DateTimeFormat for DST-aware Central Time calculation.
 */
export function isInPostTournamentWindow(endDateStr: string, now = new Date()): boolean {
  const endDate = new Date(endDateStr + 'T23:59:59');
  if (isNaN(endDate.getTime())) return false;

  // Find the first Monday on or after the end date.
  // For normal Sunday finishes this is the next day (Monday).
  // For Monday playoff finishes the cutoff is the same day at 8 AM CT,
  // which has already passed — so the window closes immediately.
  const candidate = new Date(endDate);
  while (candidate.getDay() !== MONDAY) {
    candidate.setDate(candidate.getDate() + 1);
  }

  // Build a date for that Monday at 8:00 AM CT using Intl to resolve DST offset.
  const mondayDateStr = [
    candidate.getFullYear(),
    String(candidate.getMonth() + 1).padStart(2, '0'),
    String(candidate.getDate()).padStart(2, '0'),
  ].join('-');

  const cutoffUtc = ctToUtc(mondayDateStr, GRACE_HOUR);
  return now.getTime() < cutoffUtc;
}

/**
 * Convert a date string (YYYY-MM-DD) + hour in America/Chicago to a UTC epoch ms.
 * Uses Intl.DateTimeFormat to determine the CT→UTC offset for that specific date,
 * which correctly handles CST (UTC-6) vs CDT (UTC-5).
 */
function ctToUtc(dateStr: string, hour: number): number {
  // Create a reference Date in UTC for the target day at the target hour.
  // We'll compare it against Intl-formatted CT parts to find the offset.
  const [year, month, day] = dateStr.split('-').map(Number);

  // Format an arbitrary UTC instant into CT parts to discover the offset.
  // Use noon UTC as a safe reference point (avoids date-boundary issues).
  const refUtc = Date.UTC(year, month - 1, day, 12, 0, 0);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: CT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(refUtc)).map((p) => [p.type, p.value])
  );
  const ctHourAtRef = Number(parts.hour === '24' ? '0' : parts.hour);
  // offset = CT_hour - UTC_hour (in hours). At noon UTC, CT is either 6 or 7 AM.
  const offsetHours = ctHourAtRef - 12;

  // Target: year-month-day at `hour`:00 CT → UTC = CT - offset
  return Date.UTC(year, month - 1, day, hour - offsetHours, 0, 0);
}
