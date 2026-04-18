// ─────────────────────────────────────────────
//  date-wiz — wiz() Chainable Factory
// ─────────────────────────────────────────────

import type {
  DateInput,
  DurationUnit,
  WizInstance,
  SmartFormatOptions,
  RelativeTimeOptions,
} from "./types.js";
import { toDate, isValid, clone } from "./utils.js";
import { format as _format } from "./format.js";
import { smartFormat as _smartFormat } from "./smart.js";
import { getRelativeTime } from "./relative.js";
import { add, subtract } from "./arithmetic.js";

function createWiz(date: Date): WizInstance {
  // We store an internal immutable copy
  const _d = clone(date);

  return {
    get date() {
      return clone(_d);
    },

    add(amount: number, unit: DurationUnit): WizInstance {
      return createWiz(add(_d, amount, unit));
    },

    subtract(amount: number, unit: DurationUnit): WizInstance {
      return createWiz(subtract(_d, amount, unit));
    },

    setHour(hour: number): WizInstance {
      const next = clone(_d);
      next.setHours(hour);
      return createWiz(next);
    },

    setMinute(minute: number): WizInstance {
      const next = clone(_d);
      next.setMinutes(minute);
      return createWiz(next);
    },

    format(token = "YYYY-MM-DDTHH:mm:ss", locale?: string): string {
      return _format(_d, token, locale);
    },

    smartFormat(options?: SmartFormatOptions): string {
      return _smartFormat(_d, options);
    },

    relative(options?: RelativeTimeOptions): string {
      return getRelativeTime(_d, options);
    },

    toDate(): Date {
      return clone(_d);
    },

    toISO(): string {
      return _d.toISOString();
    },

    valueOf(): number {
      return _d.getTime();
    },
  };
}

/**
 * Create a chainable date-wiz instance.
 *
 * @example
 * wiz(new Date()).add(3, 'days').format('DD MMM YYYY')
 * wiz('+2d').setHour(17).relative()
 */
export function wiz(input?: DateInput): WizInstance {
  if (input === undefined) return createWiz(new Date());

  // Lazy-import parse to keep the main wiz() function tree-shakable
  // but still support string parsing in chainable mode.
  if (typeof input === "string") {
    // Dynamic require would break tree-shaking; inline a minimal fast path
    const d = toDate(input);
    return createWiz(isValid(d) ? d : new Date());
  }

  const d = toDate(input);
  return createWiz(isValid(d) ? d : new Date());
}
