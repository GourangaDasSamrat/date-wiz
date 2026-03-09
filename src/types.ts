// ─────────────────────────────────────────────
//  date-wiz — Core Type Definitions
// ─────────────────────────────────────────────

/** Any value that can be coerced into a Date. */
export type DateInput = Date | string | number;

/** Returned instead of throwing when a date is invalid. */
export type InvalidDateFallback = string | null;

// ── Format ────────────────────────────────────

/**
 * Token-based format string.
 * Supported tokens:
 *   YYYY  – 4-digit year         (e.g. 2024)
 *   YY    – 2-digit year         (e.g. 24)
 *   MMMM  – full month name      (e.g. January)
 *   MMM   – short month name     (e.g. Jan)
 *   MM    – 2-digit month        (e.g. 01)
 *   M     – month no leading 0   (e.g. 1)
 *   DD    – 2-digit day          (e.g. 05)
 *   D     – day no leading 0     (e.g. 5)
 *   dddd  – full weekday         (e.g. Monday)
 *   ddd   – short weekday        (e.g. Mon)
 *   HH    – 24h hours padded     (e.g. 09)
 *   H     – 24h hours            (e.g. 9)
 *   hh    – 12h hours padded     (e.g. 09)
 *   h     – 12h hours            (e.g. 9)
 *   mm    – minutes padded       (e.g. 05)
 *   ss    – seconds padded       (e.g. 07)
 *   A     – AM/PM                (e.g. PM)
 *   a     – am/pm                (e.g. pm)
 *   LLL   – locale long format   (e.g. January 1, 2024 12:00 AM)
 *   LL    – locale medium        (e.g. January 1, 2024)
 *   L     – locale short         (e.g. 1/1/2024)
 *   LT    – locale time          (e.g. 12:00 AM)
 *   x     – unix ms timestamp
 *   X     – unix seconds timestamp
 */
export type FormatToken = string;

export interface FormatOptions {
  /** BCP 47 locale string. Defaults to system locale. */
  locale?: string;
  /** Fallback string when the date is invalid. */
  fallback?: InvalidDateFallback;
}

// ── Relative Time ─────────────────────────────

export interface RelativeTimeOptions {
  /** BCP 47 locale string. Defaults to "en". */
  locale?: string;
  /**
   * Number of time units to include in the output.
   * precision: 1 → "2 days ago"
   * precision: 2 → "2 days, 4 hours ago"
   */
  precision?: 1 | 2 | 3;
  /**
   * Seconds threshold below which "Just now" is shown.
   * Defaults to 45.
   */
  justNowThreshold?: number;
  /** Fallback when the date is invalid. */
  fallback?: InvalidDateFallback;
  /** The reference date to compare against. Defaults to new Date(). */
  baseDate?: DateInput;
}

// ── Smart Format ──────────────────────────────

export interface SmartFormatOptions {
  /** BCP 47 locale string. */
  locale?: string;
  /** Fallback when the date is invalid. */
  fallback?: InvalidDateFallback;
  /** Override labels for granular control. */
  labels?: Partial<SmartFormatLabels>;
}

export interface SmartFormatLabels {
  todayAt: string;    // "Today at"
  yesterdayAt: string; // "Yesterday at"
}

// ── Business Days ─────────────────────────────

export interface BusinessDayOptions {
  /**
   * ISO 8601 date strings (YYYY-MM-DD) of public holidays to skip.
   * e.g. ["2024-12-25", "2024-01-01"]
   */
  holidays?: string[];
}

export interface WorkingHoursOptions {
  /** "HH:MM" 24h start time. Defaults to "09:00". */
  start?: string;
  /** "HH:MM" 24h end time. Defaults to "17:00". */
  end?: string;
  /** Days considered working (0=Sun … 6=Sat). Defaults to [1,2,3,4,5]. */
  workDays?: number[];
}

// ── Parse ─────────────────────────────────────

export interface ParseOptions {
  /** BCP 47 locale hint for ambiguous inputs. */
  locale?: string;
  /** Returned if parsing fails. Defaults to null. */
  fallback?: InvalidDateFallback;
}

// ── Duration unit ─────────────────────────────

export type DurationUnit =
  | 'milliseconds' | 'ms'
  | 'seconds'      | 's'
  | 'minutes'      | 'm'
  | 'hours'        | 'h'
  | 'days'         | 'd'
  | 'weeks'        | 'w'
  | 'months'       | 'M'
  | 'years'        | 'y'
  | 'businessDays';

// ── Chainable Wiz instance ────────────────────

export interface WizInstance {
  /** The underlying (immutable copy of) the Date. */
  readonly date: Date;
  /** Add a duration. Returns a new WizInstance. */
  add(amount: number, unit: DurationUnit): WizInstance;
  /** Subtract a duration. Returns a new WizInstance. */
  subtract(amount: number, unit: DurationUnit): WizInstance;
  /** Set the hour (0-23). Returns a new WizInstance. */
  setHour(hour: number): WizInstance;
  /** Set the minute (0-59). Returns a new WizInstance. */
  setMinute(minute: number): WizInstance;
  /** Format with a token string. */
  format(token?: FormatToken, locale?: string): string;
  /** Smart context-aware format. */
  smartFormat(options?: SmartFormatOptions): string;
  /** Relative time string. */
  relative(options?: RelativeTimeOptions): string;
  /** Convert to native Date. */
  toDate(): Date;
  /** Convert to ISO string. */
  toISO(): string;
  /** Convert to unix ms. */
  valueOf(): number;
}
