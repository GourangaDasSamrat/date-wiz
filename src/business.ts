// ─────────────────────────────────────────────
//  date-wiz — Business Day Utilities
// ─────────────────────────────────────────────

import type {
  DateInput,
  BusinessDayOptions,
  WorkingHoursOptions,
} from "./types.js";
import { toDate, isValid, clone, toDateKey } from "./utils.js";

const DEFAULT_WORK_DAYS = [1, 2, 3, 4, 5]; // Mon–Fri

/**
 * Returns true if the date falls on a configured working day
 * and is not listed in holidays.
 */
function isBusinessDay(
  d: Date,
  workDays: number[],
  holidaySet: Set<string>,
): boolean {
  return workDays.includes(d.getDay()) && !holidaySet.has(toDateKey(d));
}

/**
 * Add `n` business days to a date, skipping weekends and optional holidays.
 *
 * @example
 * addBusinessDays(new Date(), 5)
 * addBusinessDays(new Date(), 5, { holidays: ['2024-12-25'] })
 */
export function addBusinessDays(
  date: DateInput,
  days: number,
  options: BusinessDayOptions = {},
): Date {
  const d = toDate(date);
  if (!isValid(d)) return d;

  const { holidays = [] } = options;
  const workDays = DEFAULT_WORK_DAYS;
  const holidaySet = new Set(holidays);

  const result = clone(d);
  const step = days >= 0 ? 1 : -1;
  let remaining = Math.abs(days);

  while (remaining > 0) {
    result.setDate(result.getDate() + step);
    if (isBusinessDay(result, workDays, holidaySet)) {
      remaining--;
    }
  }

  return result;
}

/**
 * Subtract `n` business days from a date.
 */
export function subtractBusinessDays(
  date: DateInput,
  days: number,
  options: BusinessDayOptions = {},
): Date {
  return addBusinessDays(date, -days, options);
}

/**
 * Count the number of business days between two dates.
 *
 * @example
 * countBusinessDays(startDate, endDate)
 * countBusinessDays(startDate, endDate, { holidays: ['2024-12-25'] })
 */
export function countBusinessDays(
  from: DateInput,
  to: DateInput,
  options: BusinessDayOptions = {},
): number {
  const start = toDate(from);
  const end = toDate(to);
  if (!isValid(start) || !isValid(end)) return NaN;

  const { holidays = [] } = options;
  const workDays = DEFAULT_WORK_DAYS;
  const holidaySet = new Set(holidays);

  const [a, b] = start <= end ? [start, end] : [end, start];
  const sign = start <= end ? 1 : -1;

  let count = 0;
  const cur = clone(a);
  cur.setDate(cur.getDate() + 1); // exclusive start

  while (cur <= b) {
    if (isBusinessDay(cur, workDays, holidaySet)) count++;
    cur.setDate(cur.getDate() + 1);
  }

  return count * sign;
}

/**
 * Returns true if the given date falls within the configured working hours
 * on a valid working day.
 *
 * @example
 * isWithinWorkingHours(new Date(), { start: '09:00', end: '18:00' })
 */
export function isWithinWorkingHours(
  date: DateInput,
  options: WorkingHoursOptions = {},
): boolean {
  const d = toDate(date);
  if (!isValid(d)) return false;

  const {
    start = "09:00",
    end = "17:00",
    workDays = DEFAULT_WORK_DAYS,
  } = options;

  if (!workDays.includes(d.getDay())) return false;

  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const nowMins = d.getHours() * 60 + d.getMinutes();
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;

  return nowMins >= startMins && nowMins < endMins;
}

/**
 * Returns true if the given date is a business day (not weekend, not holiday).
 */
export function checkIsBusinessDay(
  date: DateInput,
  options: BusinessDayOptions = {},
): boolean {
  const d = toDate(date);
  if (!isValid(d)) return false;
  const holidaySet = new Set(options.holidays ?? []);
  return isBusinessDay(d, DEFAULT_WORK_DAYS, holidaySet);
}
