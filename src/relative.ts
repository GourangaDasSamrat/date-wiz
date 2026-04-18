// ─────────────────────────────────────────────
//  date-wiz — getRelativeTime()
// ─────────────────────────────────────────────

import type { DateInput, RelativeTimeOptions } from "./types.js";
import { toDate, isValid, pickRelUnit } from "./utils.js";

/** Ordered breakdown units for multi-precision output. */
const BREAKDOWN: { unit: Intl.RelativeTimeFormatUnit; secs: number }[] = [
  { unit: "year", secs: 31_536_000 },
  { unit: "month", secs: 2_592_000 },
  { unit: "week", secs: 604_800 },
  { unit: "day", secs: 86_400 },
  { unit: "hour", secs: 3_600 },
  { unit: "minute", secs: 60 },
  { unit: "second", secs: 1 },
];

/**
 * Returns a human-readable relative time string.
 *
 * @example
 * getRelativeTime(twoDaysAgo)                        // "2 days ago"
 * getRelativeTime(twoDaysAgo, { precision: 2 })      // "2 days, 4 hours ago"
 * getRelativeTime(nextWeek, { locale: 'fr' })        // "dans 7 jours"
 */
export function getRelativeTime(
  date: DateInput,
  options: RelativeTimeOptions = {},
): string {
  const {
    locale = "en",
    precision = 1,
    justNowThreshold = 45,
    fallback,
    baseDate,
  } = options;

  const d = toDate(date);
  if (!isValid(d)) {
    return fallback !== undefined ? (fallback ?? "") : "Invalid Date";
  }

  const base = baseDate ? toDate(baseDate) : new Date();
  const diffMs = d.getTime() - base.getTime();
  const diffSecs = diffMs / 1000;
  const absSecs = Math.abs(diffSecs);
  const isFuture = diffSecs > 0;

  // "Just now" threshold
  if (absSecs < justNowThreshold) {
    // Try Intl first for localized "now"
    try {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
      return rtf.format(0, "second");
    } catch {
      return "just now";
    }
  }

  // ── Single-precision (precision === 1) ────────────────────────────────────
  if (precision === 1) {
    try {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
      const [val, unit] = pickRelUnit(diffSecs);
      return rtf.format(val, unit);
    } catch {
      const [val, unit] = pickRelUnit(diffSecs);
      const abs = Math.abs(val);
      return isFuture ? `in ${abs} ${unit}(s)` : `${abs} ${unit}(s) ago`;
    }
  }

  // ── Multi-precision ───────────────────────────────────────────────────────
  const parts: string[] = [];
  let remaining = absSecs;

  for (const { unit, secs } of BREAKDOWN) {
    if (parts.length >= precision) break;
    if (remaining < secs) continue;
    const val = Math.floor(remaining / secs);
    remaining -= val * secs;
    try {
      const rtf = new Intl.RelativeTimeFormat(locale, {
        numeric: "always",
        style: "long",
      });
      // Extract just the number + unit label without "ago"/"in"
      const raw = rtf.format(isFuture ? val : -val, unit);
      // Strip directional words from the Intl output
      const stripped = raw
        .replace(/^in\s+/i, "")
        .replace(/\s+ago$/i, "")
        .replace(/^il y a\s+/i, "")
        .replace(/\s+après$/i, "")
        .trim();
      parts.push(stripped);
    } catch {
      parts.push(`${val} ${unit}${val !== 1 ? "s" : ""}`);
    }
  }

  const joined = parts.join(", ");

  // Re-add direction
  try {
    // Use a dummy Intl call to detect "in … / … ago" pattern
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always" });
    const sample = rtf.format(isFuture ? 1 : -1, "second");
    if (sample.startsWith("in ") || /^dans/i.test(sample)) {
      return `in ${joined}`;
    }
    return `${joined} ago`;
  } catch {
    return isFuture ? `in ${joined}` : `${joined} ago`;
  }
}
