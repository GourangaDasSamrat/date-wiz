# date-wiz 🧙

> A zero-dependency, TypeScript-native date utility library — smart formatting, business logic, i18n, and intelligent parsing in under 2 KB (gzipped).

📖 **[Full documentation →](https://GourangaDasSamrat.github.io/date-wiz-docs)**

[![npm version](https://img.shields.io/npm/v/date-wiz)](https://www.npmjs.com/package/date-wiz)
[![bundle size](https://img.shields.io/bundlephobia/minzip/date-wiz)](https://bundlephobia.com/package/date-wiz)
[![license](https://img.shields.io/npm/l/date-wiz)](./LICENSE)
[![CI](https://github.com/GourangaDasSamrat/date-wiz/actions/workflows/ci.yml/badge.svg)](https://github.com/GourangaDasSamrat/date-wiz/actions/workflows/ci.yml)
[![Publish](https://github.com/GourangaDasSamrat/date-wiz/actions/workflows/publish.yml/badge.svg)](https://github.com/GourangaDasSamrat/date-wiz/actions/workflows/publish.yml)

---

## Why date-wiz?

| Feature | Moment.js | Day.js | **date-wiz** |
|---|---|---|---|
| Zero dependencies | ❌ | ✅ | ✅ |
| Bundle size | ~70 KB | ~7 KB | **< 2 KB** |
| TypeScript native | ❌ | Partial | ✅ |
| Tree-shakable (ESM) | ❌ | ❌ | ✅ |
| Business days | Plugin | Plugin | **Built-in** |
| Smart formatting | ❌ | ❌ | ✅ |
| Intelligent parsing | ❌ | ❌ | ✅ |
| Immutable | ❌ | ✅ | ✅ |
| i18n via `Intl` | ❌ | Plugin | **Built-in** |

---

## Installation

```bash
npm install date-wiz
# or
pnpm add date-wiz
# or
yarn add date-wiz
```

---

## Quick Start

```ts
import { wiz, format, getRelativeTime, parse, smartFormat } from 'date-wiz';

// Chainable API
const deadline = wiz(new Date())
  .add(3, 'businessDays')
  .setHour(17)
  .format('LLL');

// Standalone (best for tree-shaking)
const rel = getRelativeTime(oldDate, { locale: 'en', precision: 2 });
// → "2 days, 4 hours ago"
```

---

## API Reference

### `wiz(date?)` — Chainable Factory

Create an immutable, chainable date-wiz instance.

```ts
import { wiz } from 'date-wiz';

wiz()                          // wraps current time
wiz(new Date())                // wraps a Date
wiz(1715731200000)             // wraps a timestamp
wiz('2024-05-15')              // wraps a string

// Chaining
wiz(new Date())
  .add(5, 'days')
  .subtract(2, 'hours')
  .setHour(9)
  .setMinute(30)
  .format('YYYY-MM-DD HH:mm') // "2024-05-20 09:30"

// Available chain methods
.add(amount, unit)      // → new WizInstance
.subtract(amount, unit) // → new WizInstance
.setHour(0-23)          // → new WizInstance
.setMinute(0-59)        // → new WizInstance
.format(token?, locale?) // → string
.smartFormat(options?)   // → string
.relative(options?)      // → string
.toDate()                // → Date
.toISO()                 // → string (ISO 8601)
.valueOf()               // → number (unix ms)
```

---

### `format(date, token?, locale?, opts?)` — Token Formatting

```ts
import { format } from 'date-wiz';
// or: import { format } from 'date-wiz/format';

format(new Date(), 'YYYY-MM-DD')          // "2026-03-15"
format(new Date(), 'DD MMMM YYYY', 'en') // "15 March 2026"
format(new Date(), 'DD MMMM', 'bn-BD')   // "১৫ মার্চ"
format(new Date(), 'hh:mm A')            // "02:30 PM"
format(new Date(), 'LLL')                // "March 15, 2026 at 2:30 PM"
format('bad input', 'YYYY', undefined, { fallback: 'N/A' }) // "N/A"
```

**Supported tokens:**

| Token | Output | Example |
|---|---|---|
| `YYYY` | 4-digit year | `2026` |
| `YY` | 2-digit year | `26` |
| `MMMM` | Full month (i18n) | `March` |
| `MMM` | Short month (i18n) | `Mar` |
| `MM` | Month 2-digit | `03` |
| `M` | Month no pad | `3` |
| `DD` | Day 2-digit | `05` |
| `D` | Day no pad | `5` |
| `dddd` | Full weekday (i18n) | `Sunday` |
| `ddd` | Short weekday (i18n) | `Sun` |
| `HH` | 24h hours padded | `14` |
| `H` | 24h hours | `14` |
| `hh` | 12h hours padded | `02` |
| `h` | 12h hours | `2` |
| `mm` | Minutes padded | `05` |
| `ss` | Seconds padded | `07` |
| `A` | AM/PM | `PM` |
| `a` | am/pm | `pm` |
| `LLL` | Locale long | `March 15, 2026 at 2:30 PM` |
| `LL` | Locale medium | `March 15, 2026` |
| `L` | Locale short | `3/15/2026` |
| `LT` | Locale time | `2:30 PM` |
| `x` | Unix ms | `1710504600000` |
| `X` | Unix seconds | `1710504600` |

---

### `getRelativeTime(date, options?)` — Relative Time

```ts
import { getRelativeTime } from 'date-wiz';
// or: import { getRelativeTime } from 'date-wiz/relative';

getRelativeTime(twoDaysAgo)
// → "2 days ago"

getRelativeTime(twoDaysAgo, { precision: 2 })
// → "2 days, 4 hours ago"

getRelativeTime(nextWeek, { locale: 'fr' })
// → "dans 7 jours"

getRelativeTime(fiveMinutesAgo, { locale: 'bn' })
// → "৫ মিনিট আগে"
```

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `locale` | `string` | `'en'` | BCP 47 locale |
| `precision` | `1 \| 2 \| 3` | `1` | Number of units to include |
| `justNowThreshold` | `number` | `45` | Seconds below which "just now" is shown |
| `fallback` | `string \| null` | `'Invalid Date'` | Value for invalid inputs |
| `baseDate` | `DateInput` | `new Date()` | Reference point for comparison |

---

### `smartFormat(date, options?)` — Context-Aware Formatting

Automatically picks the most readable format based on the current time:

```ts
import { smartFormat } from 'date-wiz';

smartFormat(new Date())                    // "Today at 2:30 PM"
smartFormat(yesterday)                     // "Yesterday at 11:00 AM"
smartFormat(threeDaysAgo)                  // "Thursday at 9:00 AM"
smartFormat(new Date('2026-01-05'))        // "Jan 5"
smartFormat(new Date('2022-10-12'))        // "Oct 12, 2022"

// Custom labels
smartFormat(new Date(), {
  locale: 'pt-BR',
  labels: { todayAt: 'Hoje às', yesterdayAt: 'Ontem às' }
})
// → "Hoje às 14:30"
```

---

### `parse(input, options?)` — Intelligent Parsing

Accepts 20+ date formats without a strict format string:

```ts
import { parse } from 'date-wiz';
// or: import { parse } from 'date-wiz/parse';

parse('2024-05-15')      // ISO 8601
parse('20240515')        // Compact YYYYMMDD
parse('15-05-2024')      // DD-MM-YYYY
parse('May 15, 2024')    // Natural language
parse('+2d')             // 2 days from now
parse('-1w')             // 1 week ago
parse('+3M')             // 3 months from now
parse('+4h')             // 4 hours from now
parse('next_monday')     // Next Monday
parse('last_friday')     // Last Friday
parse('bad input')       // → null
```

**Supported shorthand units for `+N<unit>` / `-N<unit>`:**

| Unit | Symbol |
|---|---|
| Milliseconds | `ms` |
| Seconds | `s` |
| Minutes | `m` |
| Hours | `h` |
| Days | `d` |
| Weeks | `w` |
| Months | `M` |
| Years | `y` |

---

### Business Day Utilities

```ts
import { addBusinessDays, subtractBusinessDays, countBusinessDays, isWithinWorkingHours, checkIsBusinessDay } from 'date-wiz';
// or: import { ... } from 'date-wiz/business';

// Add 5 business days (skips weekends)
addBusinessDays(new Date(), 5)

// With holiday exclusions
addBusinessDays(new Date(), 5, {
  holidays: ['2024-12-25', '2024-01-01']
})

// Subtract business days
subtractBusinessDays(new Date(), 3)

// Count business days between two dates
countBusinessDays(startDate, endDate)
countBusinessDays(startDate, endDate, { holidays: ['2024-12-25'] })

// SLA / working hours check
isWithinWorkingHours(new Date(), { start: '09:00', end: '18:00' })
isWithinWorkingHours(new Date(), {
  start: '09:00',
  end: '18:00',
  workDays: [0, 1, 2, 3, 4, 5, 6] // all days
})

// Is today a business day?
checkIsBusinessDay(new Date())
checkIsBusinessDay(new Date(), { holidays: ['2024-12-25'] })
```

---

### Arithmetic Utilities

```ts
import { add, subtract, diff, isBefore, isAfter, isSameDay, clampDate, startOf, endOf } from 'date-wiz';

add(date, 3, 'days')          // new Date, 3 days later
subtract(date, 2, 'hours')    // new Date, 2 hours earlier
diff(dateA, dateB, 'days')    // number (e.g. 14)

isBefore(dateA, dateB)        // boolean
isAfter(dateA, dateB)         // boolean
isSameDay(dateA, dateB)       // boolean

clampDate(date, min, max)     // clamped Date

startOf(date, 'day')          // 2026-03-15T00:00:00.000
startOf(date, 'month')        // 2026-03-01T00:00:00.000
startOf(date, 'year')         // 2026-01-01T00:00:00.000

endOf(date, 'day')            // 2026-03-15T23:59:59.999
endOf(date, 'month')          // 2026-03-31T23:59:59.999
```

**Duration units:**

`milliseconds` / `ms`, `seconds` / `s`, `minutes` / `m`, `hours` / `h`, `days` / `d`, `weeks` / `w`, `months` / `M`, `years` / `y`, `businessDays`

---

## Tree-Shaking (Sub-path Imports)

Import only what you need for the smallest possible bundle:

```ts
import { format }          from 'date-wiz/format';
import { getRelativeTime } from 'date-wiz/relative';
import { addBusinessDays } from 'date-wiz/business';
import { parse }           from 'date-wiz/parse';
```

---

## i18n Examples

All locale support is powered by the native `Intl` API — no locale files bundled:

```ts
format(new Date(), 'DD MMMM YYYY', 'bn-BD')  // "১৫ মার্চ ২০২৬"
format(new Date(), 'MMMM', 'ar')             // "مارس"
format(new Date(), 'dddd', 'ja')             // "日曜日"
getRelativeTime(date, { locale: 'fr' })      // "il y a 2 jours"
getRelativeTime(date, { locale: 'de' })      // "vor 2 Tagen"
```

---

## Error Handling

`date-wiz` never throws on invalid input. Every function accepts a `fallback` option:

```ts
format('bad', 'YYYY')                             // "Invalid Date"
format('bad', 'YYYY', undefined, { fallback: '' }) // ""
getRelativeTime('bad', { fallback: null })          // null → ""
parse('???')                                       // null
```

---

## Environments

Supports all modern environments:

- **Node.js** ≥ 14 (CJS `require` and ESM `import`)
- **Browsers** (ESM / UMD via CDN)
- **React / Vite / Next.js / Webpack** (tree-shakable ESM)
- **Deno** (ESM)

```html
<!-- CDN (UMD) -->
<script src="https://unpkg.com/date-wiz/dist/umd/index.js"></script>
<script>
  const { format } = dateWiz;
  console.log(format(new Date(), 'DD MMM YYYY'));
</script>
```

---

## License

[MIT](./LICENSE) © [GourangaDasSamrat](https://github.com/GourangaDasSamrat)
