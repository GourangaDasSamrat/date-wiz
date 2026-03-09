// ─────────────────────────────────────────────
//  date-wiz — Internal Utilities (not exported)
// ─────────────────────────────────────────────

import type { DateInput } from './types.js';

/**
 * Coerce any DateInput to a Date.
 * Never throws — returns an Invalid Date on failure.
 */
export function toDate(input: DateInput): Date {
  if (input instanceof Date) return new Date(input.getTime());
  if (typeof input === 'number') return new Date(input);
  // String: let the runtime parse, but normalise common separators first
  const normalised = String(input).trim().replace(/\//g, '-');
  return new Date(normalised);
}

/** Returns true when a Date object carries a valid time value. */
export function isValid(d: Date): boolean {
  return d instanceof Date && !isNaN(d.getTime());
}

/** Zero-pad a number to `width` digits. */
export function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0');
}

/** Clone a Date — the single point where we guarantee immutability. */
export function clone(d: Date): Date {
  return new Date(d.getTime());
}

/**
 * Safely get an Intl.RelativeTimeFormat unit from raw seconds.
 * Returns the best [value, unit] pair to pass to the formatter.
 */
export function pickRelUnit(
  totalSeconds: number,
): [number, Intl.RelativeTimeFormatUnit] {
  const abs = Math.abs(totalSeconds);

  if (abs < 60) return [Math.round(totalSeconds), 'second'];
  if (abs < 3600) return [Math.round(totalSeconds / 60), 'minute'];
  if (abs < 86_400) return [Math.round(totalSeconds / 3600), 'hour'];
  if (abs < 86_400 * 7) return [Math.round(totalSeconds / 86_400), 'day'];
  if (abs < 86_400 * 30) return [Math.round(totalSeconds / (86_400 * 7)), 'week'];
  if (abs < 86_400 * 365) return [Math.round(totalSeconds / (86_400 * 30)), 'month'];
  return [Math.round(totalSeconds / (86_400 * 365)), 'year'];
}

/** Normalize a YYYY-MM-DD string for holiday comparisons. */
export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
