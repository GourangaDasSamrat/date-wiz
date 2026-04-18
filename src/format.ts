// ─────────────────────────────────────────────
//  date-wiz — format()
// ─────────────────────────────────────────────

import type { FormatToken, FormatOptions } from "./types.js";
import { toDate, isValid, pad } from "./utils.js";
import type { DateInput } from "./types.js";

// Token regex — order matters (longer tokens must come first).
const TOKEN_RE =
  /YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|HH|H|hh|h|mm|ss|A|a|LLL|LL|LT|L|x|X/g;

/**
 * Format a date using a token-based format string.
 *
 * @param date   - Any DateInput value.
 * @param token  - Format string. Defaults to ISO 8601 ("YYYY-MM-DDTHH:mm:ss").
 * @param locale - BCP 47 locale string. Defaults to system locale.
 * @param opts   - Additional options.
 *
 * @example
 * format(new Date(), 'DD MMMM YYYY')           // "15 March 2026"
 * format(new Date(), 'DD MMMM', 'bn-BD')       // "১৫ মার্চ"
 * format(new Date(), 'LLL')                    // locale long string
 */
export function format(
  date: DateInput,
  token: FormatToken = "YYYY-MM-DDTHH:mm:ss",
  locale?: string,
  opts: FormatOptions = {},
): string {
  const d = toDate(date);

  if (!isValid(d)) {
    return opts.fallback !== undefined ? (opts.fallback ?? "") : "Invalid Date";
  }

  const loc = locale ?? opts.locale;

  // ── Locale-aware tokens via Intl ──────────────────────────────────────────
  if (token === "LLL") {
    return new Intl.DateTimeFormat(loc, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  }
  if (token === "LL") {
    return new Intl.DateTimeFormat(loc, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  }
  if (token === "L") {
    return new Intl.DateTimeFormat(loc, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(d);
  }
  if (token === "LT") {
    return new Intl.DateTimeFormat(loc, {
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  }

  // ── Pre-compute all possible values ───────────────────────────────────────
  const Y = d.getFullYear();
  const Mo = d.getMonth(); // 0-based
  const Da = d.getDate();
  const Wd = d.getDay(); // 0=Sun
  const Hr = d.getHours();
  const Mi = d.getMinutes();
  const Se = d.getSeconds();
  const hr12 = Hr % 12 || 12;
  const ampm = Hr < 12 ? "AM" : "PM";

  // Intl-powered month/weekday names
  const monthLong = new Intl.DateTimeFormat(loc, { month: "long" }).format(d);
  const monthShort = new Intl.DateTimeFormat(loc, { month: "short" }).format(d);
  const dayLong = new Intl.DateTimeFormat(loc, { weekday: "long" }).format(d);
  const dayShort = new Intl.DateTimeFormat(loc, { weekday: "short" }).format(d);

  const map: Record<string, string> = {
    YYYY: String(Y),
    YY: String(Y).slice(-2),
    MMMM: monthLong,
    MMM: monthShort,
    MM: pad(Mo + 1),
    M: String(Mo + 1),
    DD: pad(Da),
    D: String(Da),
    dddd: dayLong,
    ddd: dayShort,
    HH: pad(Hr),
    H: String(Hr),
    hh: pad(hr12),
    h: String(hr12),
    mm: pad(Mi),
    ss: pad(Se),
    A: ampm,
    a: ampm.toLowerCase(),
    x: String(d.getTime()),
    X: String(Math.floor(d.getTime() / 1000)),
  };

  return token.replace(TOKEN_RE, (t) => map[t] ?? t);
}
