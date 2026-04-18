// ─────────────────────────────────────────────
//  date-wiz — Public API (barrel)
// ─────────────────────────────────────────────
//
//  Tree-shakable: consumers can import individual
//  utilities directly from their sub-paths:
//
//    import { format }         from 'date-wiz/format';
//    import { getRelativeTime } from 'date-wiz/relative';
//    import { addBusinessDays } from 'date-wiz/business';
//    import { parse }           from 'date-wiz/parse';
//
//  Or import everything from the root:
//
//    import { wiz, format, parse } from 'date-wiz';
// ─────────────────────────────────────────────

// Chainable factory
export { wiz } from "./wiz.js";

// Formatting
export { format } from "./format.js";
export { smartFormat } from "./smart.js";

// Relative time
export { getRelativeTime } from "./relative.js";

// Parsing
export { parse } from "./parse.js";

// Arithmetic
export {
  add,
  subtract,
  diff,
  isBefore,
  isAfter,
  isSameDay,
  clampDate,
  startOf,
  endOf,
} from "./arithmetic.js";

// Business days
export {
  addBusinessDays,
  subtractBusinessDays,
  countBusinessDays,
  isWithinWorkingHours,
  checkIsBusinessDay,
} from "./business.js";

// Types (re-exported for library consumers)
export type {
  DateInput,
  FormatToken,
  FormatOptions,
  RelativeTimeOptions,
  SmartFormatOptions,
  SmartFormatLabels,
  BusinessDayOptions,
  WorkingHoursOptions,
  ParseOptions,
  DurationUnit,
  WizInstance,
  InvalidDateFallback,
} from "./types.js";
