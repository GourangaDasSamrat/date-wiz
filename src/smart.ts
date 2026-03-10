// ─────────────────────────────────────────────
//  date-wiz — smartFormat()
// ─────────────────────────────────────────────

import type { DateInput, SmartFormatOptions } from './types.js';
import { toDate, isValid } from './utils.js';
import { format } from './format.js';

/**
 * Context-aware date formatting.
 *
 * - **Today**     → "Today at 4:30 PM"
 * - **Yesterday** → "Yesterday at 11:00 AM"
 * - **This week** → "Wednesday at 2:00 PM"
 * - **This year** → "Oct 12"
 * - **Past years** → "Oct 12, 2022"
 */
export function smartFormat(
  date: DateInput,
  options: SmartFormatOptions = {},
): string {
  const { locale, fallback, labels = {} } = options;

  const d = toDate(date);
  if (!isValid(d)) {
    return fallback !== undefined ? (fallback ?? '') : 'Invalid Date';
  }

  const now      = new Date();
  const todayAt  = labels.todayAt     ?? 'Today at';
  const yesterAt = labels.yesterdayAt ?? 'Yesterday at';

  const sod = (ref: Date): Date =>
    new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());

  const inputDay  = sod(d).getTime();
  const todayDay  = sod(now).getTime();
  const diff      = todayDay - inputDay;   // positive = past

  const timeStr = new Intl.DateTimeFormat(locale, {
    hour: 'numeric', minute: '2-digit',
  }).format(d);

  // Today
  if (diff === 0) return `${todayAt} ${timeStr}`;

  // Yesterday
  if (diff === 86_400_000) return `${yesterAt} ${timeStr}`;

  // This week (within last 6 days)
  if (diff > 0 && diff < 7 * 86_400_000) {
    const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(d);
    return `${weekday} at ${timeStr}`;
  }

  // This year
  if (d.getFullYear() === now.getFullYear()) {
    return format(d, 'MMM D', locale);
  }

  // Past / future years
  return format(d, 'MMM D, YYYY', locale);
}
