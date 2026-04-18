// ─────────────────────────────────────────────
//  date-wiz — add() / subtract()
// ─────────────────────────────────────────────

import type { DateInput, DurationUnit } from "./types.js";
import { toDate, isValid, clone } from "./utils.js";
import { addBusinessDays } from "./business.js";

/**
 * Add a given amount of a time unit to a date (immutable).
 *
 * @example
 * add(new Date(), 3, 'days')
 * add(new Date(), 2, 'months')
 * add(new Date(), 5, 'businessDays')
 */
export function add(date: DateInput, amount: number, unit: DurationUnit): Date {
  const d = toDate(date);
  if (!isValid(d)) return d;

  const result = clone(d);

  switch (unit) {
    case "milliseconds":
    case "ms":
      result.setTime(result.getTime() + amount);
      break;
    case "seconds":
    case "s":
      result.setTime(result.getTime() + amount * 1_000);
      break;
    case "minutes":
    case "m":
      result.setTime(result.getTime() + amount * 60_000);
      break;
    case "hours":
    case "h":
      result.setTime(result.getTime() + amount * 3_600_000);
      break;
    case "days":
    case "d":
      result.setDate(result.getDate() + amount);
      break;
    case "weeks":
    case "w":
      result.setDate(result.getDate() + amount * 7);
      break;
    case "months":
    case "M": {
      const target = result.getMonth() + amount;
      result.setMonth(target);
      break;
    }
    case "years":
    case "y":
      result.setFullYear(result.getFullYear() + amount);
      break;
    case "businessDays":
      return addBusinessDays(result, amount);
  }

  return result;
}

/**
 * Subtract a given amount of a time unit from a date (immutable).
 *
 * @example
 * subtract(new Date(), 1, 'week')
 */
export function subtract(
  date: DateInput,
  amount: number,
  unit: DurationUnit,
): Date {
  return add(date, -amount, unit);
}

/**
 * Get the difference between two dates in a given unit.
 *
 * @example
 * diff(new Date(), pastDate, 'days')   // e.g. 14
 */
export function diff(
  a: DateInput,
  b: DateInput,
  unit: DurationUnit = "milliseconds",
): number {
  const da = toDate(a);
  const db = toDate(b);
  if (!isValid(da) || !isValid(db)) return NaN;

  const deltaMs = da.getTime() - db.getTime();

  switch (unit) {
    case "milliseconds":
    case "ms":
      return deltaMs;
    case "seconds":
    case "s":
      return deltaMs / 1_000;
    case "minutes":
    case "m":
      return deltaMs / 60_000;
    case "hours":
    case "h":
      return deltaMs / 3_600_000;
    case "days":
    case "d":
      return deltaMs / 86_400_000;
    case "weeks":
    case "w":
      return deltaMs / 604_800_000;
    case "months":
    case "M":
      return deltaMs / 2_592_000_000;
    case "years":
    case "y":
      return deltaMs / 31_536_000_000;
    default:
      return deltaMs;
  }
}

/**
 * Returns true when `a` is before `b`.
 */
export function isBefore(a: DateInput, b: DateInput): boolean {
  return toDate(a).getTime() < toDate(b).getTime();
}

/**
 * Returns true when `a` is after `b`.
 */
export function isAfter(a: DateInput, b: DateInput): boolean {
  return toDate(a).getTime() > toDate(b).getTime();
}

/**
 * Returns true when `a` and `b` represent the same calendar day.
 */
export function isSameDay(a: DateInput, b: DateInput): boolean {
  const da = toDate(a);
  const db = toDate(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

/**
 * Clamp a date between `min` and `max`.
 */
export function clampDate(
  date: DateInput,
  min: DateInput,
  max: DateInput,
): Date {
  const d = toDate(date);
  const lo = toDate(min);
  const hi = toDate(max);
  if (d < lo) return clone(lo);
  if (d > hi) return clone(hi);
  return clone(d);
}

/**
 * Return the start of a given unit for a date (immutable).
 *
 * @example
 * startOf(new Date(), 'day')   // 2026-03-15T00:00:00.000
 * startOf(new Date(), 'month') // 2026-03-01T00:00:00.000
 */
export function startOf(
  date: DateInput,
  unit: "year" | "month" | "week" | "day" | "hour" | "minute",
): Date {
  const d = clone(toDate(date));
  switch (unit) {
    case "year":
      d.setMonth(0); // falls through
    case "month":
      d.setDate(1); // falls through
    case "day":
      d.setHours(0, 0, 0, 0);
      break;
    case "week":
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0, 0, 0, 0);
      break;
    case "hour":
      d.setMinutes(0, 0, 0);
      break;
    case "minute":
      d.setSeconds(0, 0);
      break;
  }
  return d;
}

/**
 * Return the end of a given unit for a date (immutable).
 */
export function endOf(
  date: DateInput,
  unit: "year" | "month" | "week" | "day" | "hour" | "minute",
): Date {
  const d = startOf(date, unit);
  switch (unit) {
    case "year":
      d.setFullYear(d.getFullYear() + 1);
      break;
    case "month":
      d.setMonth(d.getMonth() + 1);
      break;
    case "week":
      d.setDate(d.getDate() + 7);
      break;
    case "day":
      d.setDate(d.getDate() + 1);
      break;
    case "hour":
      d.setHours(d.getHours() + 1);
      break;
    case "minute":
      d.setMinutes(d.getMinutes() + 1);
      break;
  }
  d.setTime(d.getTime() - 1);
  return d;
}
