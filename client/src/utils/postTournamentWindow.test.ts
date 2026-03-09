import { isInPostTournamentWindow } from './postTournamentWindow';

describe('isInPostTournamentWindow', () => {
  // Tournament ends Saturday 2026-02-07 (firmly in CST / UTC-6).
  // Next Monday = 2026-02-09. Cutoff = Monday 8:00 AM CST = 14:00 UTC.
  const saturdayEnd = '2026-02-07';

  it('returns true on Sunday (well within window)', () => {
    const sunday = new Date('2026-02-08T18:00:00Z');
    expect(isInPostTournamentWindow(saturdayEnd, sunday)).toBe(true);
  });

  it('returns true on Monday at 7:59 AM CT (13:59 UTC, just before cutoff)', () => {
    const justBefore = new Date('2026-02-09T13:59:00Z');
    expect(isInPostTournamentWindow(saturdayEnd, justBefore)).toBe(true);
  });

  it('returns false on Monday at 8:00 AM CT (14:00 UTC, at cutoff)', () => {
    const atCutoff = new Date('2026-02-09T14:00:00Z');
    expect(isInPostTournamentWindow(saturdayEnd, atCutoff)).toBe(false);
  });

  it('returns false on Monday at 9:00 AM CT (after cutoff)', () => {
    const afterCutoff = new Date('2026-02-09T15:00:00Z');
    expect(isInPostTournamentWindow(saturdayEnd, afterCutoff)).toBe(false);
  });

  // Tournament ends on a Monday (playoff): cutoff is same Monday 8 AM CT.
  // By the time a Monday playoff finishes (afternoon), the cutoff has already
  // passed — so the window is effectively closed immediately.
  it('handles Monday end dates (playoff — immediate switchover)', () => {
    const mondayEnd = '2026-02-09'; // Monday, CST
    // Same Monday = 2026-02-09. Cutoff = 2026-02-09T14:00:00Z (8 AM CST).
    const mondayMorning = new Date('2026-02-09T13:59:00Z');
    expect(isInPostTournamentWindow(mondayEnd, mondayMorning)).toBe(true);

    const mondayAfternoon = new Date('2026-02-09T14:00:00Z');
    expect(isInPostTournamentWindow(mondayEnd, mondayAfternoon)).toBe(false);
  });

  // DST boundary: DST starts 2026-03-08. A tournament ending 2026-03-08 (Sunday)
  // has cutoff on Monday 2026-03-09. By then CDT (UTC-5) is in effect.
  // Monday 8 AM CDT = Monday 13:00 UTC.
  it('handles DST spring-forward correctly', () => {
    const dstSundayEnd = '2026-03-08'; // DST starts this day
    // Next Monday = 2026-03-09. CDT (UTC-5), so cutoff = 13:00 UTC.
    const justBeforeCdt = new Date('2026-03-09T12:59:00Z');
    expect(isInPostTournamentWindow(dstSundayEnd, justBeforeCdt)).toBe(true);

    const atCutoffCdt = new Date('2026-03-09T13:00:00Z');
    expect(isInPostTournamentWindow(dstSundayEnd, atCutoffCdt)).toBe(false);
  });

  it('returns false for invalid date strings', () => {
    expect(isInPostTournamentWindow('not-a-date', new Date())).toBe(false);
  });

  // Tournament ends on a Sunday — next Monday is the very next day.
  it('handles Sunday end date (cutoff is next day Monday)', () => {
    const sundayEnd = '2026-02-22'; // Sunday, still CST
    // Next Monday = 2026-02-23. CST (UTC-6), cutoff = 14:00 UTC.
    const sundayEvening = new Date('2026-02-22T23:00:00Z');
    expect(isInPostTournamentWindow(sundayEnd, sundayEvening)).toBe(true);

    const mondayCutoff = new Date('2026-02-23T14:00:00Z');
    expect(isInPostTournamentWindow(sundayEnd, mondayCutoff)).toBe(false);
  });
});
