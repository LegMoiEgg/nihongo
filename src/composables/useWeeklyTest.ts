/**
 * Weekly test helpers: the Sunday test is offered once per week, only on
 * Sundays, and only if it hasn't been done/dismissed this week yet.
 *
 * "This week" is keyed by an ISO week string (year + week number) stored in
 * localStorage, so the marker naturally resets every new week.
 */

const STORAGE_KEY = 'nihongo_weekly_test_done'

/** ISO week key like "2026-W36" for the given date (local time). */
export function isoWeekKey(date = new Date()): string {
  // Copy so we don't mutate the input.
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  // ISO week: Thursday decides the week's year.
  const dayNum = (d.getUTCDay() + 6) % 7 // Mon=0 … Sun=6
  d.setUTCDate(d.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3)
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000))
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

/** True if today is Sunday. */
export function isSunday(date = new Date()): boolean {
  return date.getDay() === 0
}

/** Has the weekly test already been done/dismissed this ISO week? */
export function weeklyTestDoneThisWeek(): boolean {
  return localStorage.getItem(STORAGE_KEY) === isoWeekKey()
}

/** Mark the weekly test as done/dismissed for the current ISO week. */
export function markWeeklyTestDone(): void {
  localStorage.setItem(STORAGE_KEY, isoWeekKey())
}

/**
 * Should we show the Sunday test popup right now?
 * Only on Sundays, and only if not already done/dismissed this week.
 */
export function shouldOfferWeeklyTest(): boolean {
  return isSunday() && !weeklyTestDoneThisWeek()
}
