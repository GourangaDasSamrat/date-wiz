// ─────────────────────────────────────────────
//  date-wiz — parse()
// ─────────────────────────────────────────────

import type { DateInput, ParseOptions } from './types.js';
import { toDate, isValid, clone } from './utils.js';

/** Named-day map for "next_monday" style strings. */
const DAY_NAMES: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

/**
 * Pattern matchers — each returns `Date | null`.
 * Order matters: more specific patterns first.
 */
const PATTERNS: Array<(s: string) => Date | null> = [
  // ── Relative shorthand: +2d, -1w, +3M, -2y, +4h, +30m, +45s ─────────────
  (s) => {
    const m = s.match(/^([+-])(\d+)\s*(ms|s|m|h|d|w|M|y)$/);
    if (!m) return null;
    const sign   = m[1] === '+' ? 1 : -1;
    const amount = parseInt(m[2], 10) * sign;
    const unit   = m[3];
    const now    = new Date();

    switch (unit) {
      case 'ms': return new Date(now.getTime() + amount);
      case 's':  return new Date(now.getTime() + amount * 1000);
      case 'm':  return new Date(now.getTime() + amount * 60_000);
      case 'h':  return new Date(now.getTime() + amount * 3_600_000);
      case 'd':  return new Date(now.getTime() + amount * 86_400_000);
      case 'w':  return new Date(now.getTime() + amount * 604_800_000);
      case 'M': {
        const d = new Date(now);
        d.setMonth(d.getMonth() + amount);
        return d;
      }
      case 'y': {
        const d = new Date(now);
        d.setFullYear(d.getFullYear() + amount);
        return d;
      }
    }
    return null;
  },

  // ── next_<weekday> / last_<weekday> ──────────────────────────────────────
  (s) => {
    const m = s.match(/^(next|last)_(\w+)$/i);
    if (!m) return null;
    const direction = m[1].toLowerCase() as 'next' | 'last';
    const target    = DAY_NAMES[m[2].toLowerCase()];
    if (target === undefined) return null;

    const now    = new Date();
    const curDay = now.getDay();
    let   delta  = target - curDay;

    if (direction === 'next') {
      if (delta <= 0) delta += 7;
    } else {
      if (delta >= 0) delta -= 7;
    }

    return new Date(now.getTime() + delta * 86_400_000);
  },

  // ── Compact: 20240515 ─────────────────────────────────────────────────────
  (s) => {
    const m = s.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (!m) return null;
    return new Date(`${m[1]}-${m[2]}-${m[3]}`);
  },

  // ── DD-MM-YYYY or DD/MM/YYYY ──────────────────────────────────────────────
  (s) => {
    const m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (!m) return null;
    // Interpret as DD-MM-YYYY
    return new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`);
  },

  // ── YYYY-MM-DD or YYYY/MM/DD ──────────────────────────────────────────────
  (s) => {
    const m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (!m) return null;
    return new Date(`${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`);
  },

  // ── "May 15" / "15 May" / "May 15, 2024" ─────────────────────────────────
  (s) => {
    const month = new Date(`${s} 2000`);
    if (isValid(month)) return new Date(s);
    return null;
  },

  // ── Fallback: native Date parsing ─────────────────────────────────────────
  (s) => {
    const d = new Date(s);
    return isValid(d) ? d : null;
  },
];

/**
 * Intelligently parse a wide range of date strings into a Date object.
 *
 * Supports:
 * - ISO 8601 strings
 * - Compact: `20240515`
 * - Locale-style: `15-05-2024`, `05/15/2024`
 * - Natural: `May 15`, `May 15 2024`
 * - Relative shorthand: `+2d`, `-1w`, `+3M`, `+2h`
 * - Named: `next_monday`, `last_friday`
 *
 * @example
 * parse('20240515')       // Date(2024-05-15)
 * parse('+2d')            // 2 days from now
 * parse('next_monday')    // next Monday
 * parse('15-05-2024')     // Date(2024-05-15)
 */
export function parse(input: DateInput, options: ParseOptions = {}): Date | null {
  const { fallback = null } = options;

  // Pass-through for Date and number inputs
  if (typeof input !== 'string') {
    const d = toDate(input);
    return isValid(d) ? d : (fallback as null);
  }

  const s = input.trim();

  for (const pattern of PATTERNS) {
    const result = pattern(s);
    if (result && isValid(result)) return clone(result);
  }

  return fallback as null;
}
