<div align="center">

# date-wiz 🧙

**A zero-dependency, TypeScript-native date utility library.**
Smart formatting · Business day logic · Intelligent parsing · Full i18n — all in under 2 KB gzipped.

[![npm version](https://img.shields.io/npm/v/date-wiz?style=flat-square&color=7c3aed)](https://www.npmjs.com/package/date-wiz)
[![bundle size](https://img.shields.io/bundlephobia/minzip/date-wiz?style=flat-square&color=7c3aed&label=gzipped)](https://bundlephobia.com/package/date-wiz)
[![license](https://img.shields.io/npm/l/date-wiz?style=flat-square&color=7c3aed)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/GourangaDasSamrat/date-wiz/ci.yml?style=flat-square&label=CI)](https://github.com/GourangaDasSamrat/date-wiz/actions/workflows/ci.yml)
[![npm downloads](https://img.shields.io/npm/dm/date-wiz?style=flat-square&color=7c3aed)](https://www.npmjs.com/package/date-wiz)

<br/>

### 📖 [Full Documentation →](https://GourangaDasSamrat.github.io/date-wiz-docs)

_Guides · API reference · Examples · i18n · Tree-shaking_

</div>

---

## Overview

```ts
import { wiz, format, getRelativeTime, smartFormat, parse } from "date-wiz";

// Chainable API
const deadline = wiz(new Date())
  .add(3, "businessDays")
  .setHour(17)
  .format("LLL");
// → "March 20, 2026 at 5:00 PM"

// Relative time with precision
getRelativeTime(twoDaysAgo, { precision: 2, locale: "en" });
// → "2 days, 4 hours ago"

// Context-aware smart labels
smartFormat(new Date()); // → "Today at 2:30 PM"
smartFormat(yesterday); // → "Yesterday at 11:00 AM"
smartFormat(new Date("2022-10-12")); // → "Oct 12, 2022"

// i18n — zero locale files bundled
format(new Date(), "DD MMMM YYYY", "bn-BD"); // → "১৫ মার্চ ২০২৬"
format(new Date(), "DD MMMM YYYY", "ar"); // → "١٥ مارس ٢٠٢٦"

// Intelligent parsing — no format string needed
parse("+2d"); // → 2 days from now
parse("next_monday"); // → next Monday
parse("15-05-2024"); // → Date(2024-05-15)
```

> **The README covers the essentials. For complete guides, all API options, React/Next.js examples, and more — visit the [documentation site](https://GourangaDasSamrat.github.io/date-wiz-docs).**

---

## Why date-wiz?

|                                | Moment.js | Day.js  | **date-wiz** |
| ------------------------------ | :-------: | :-----: | :----------: |
| Zero runtime dependencies      |    ❌     |   ✅    |      ✅      |
| Bundle size (gzipped)          |  ~70 KB   |  ~7 KB  |  **< 2 KB**  |
| TypeScript native              |    ❌     | Partial |      ✅      |
| Tree-shakable ESM              |    ❌     |   ❌    |      ✅      |
| Business day logic             |  Plugin   | Plugin  | ✅ Built-in  |
| Smart context-aware formatting |    ❌     |   ❌    | ✅ Built-in  |
| Intelligent parsing            |    ❌     |   ❌    | ✅ Built-in  |
| i18n via native `Intl`         |    ❌     | Plugin  | ✅ Built-in  |
| Immutable operations           |    ❌     |   ✅    |      ✅      |

---

## Installation

```bash
npm install date-wiz
# or
pnpm add date-wiz
# or
yarn add date-wiz
```

**Requirements:** Node.js ≥ 14 · TypeScript ≥ 4.7 (optional but recommended)

---

## Features at a glance

### `format()` — Token-based formatting

```ts
import { format } from "date-wiz";

format(new Date(), "YYYY-MM-DD"); // "2026-03-15"
format(new Date(), "DD MMMM YYYY", "en"); // "15 March 2026"
format(new Date(), "DD MMMM", "bn-BD"); // "১৫ মার্চ"
format(new Date(), "LLL"); // "March 15, 2026 at 2:30 PM"
format("invalid", "YYYY", undefined, { fallback: "N/A" }); // "N/A"
```

Supports 20+ tokens: `YYYY`, `MM`, `DD`, `HH`, `mm`, `ss`, `dddd`, `MMMM`, `LLL`, `x`, and more.
→ [Full token reference](https://GourangaDasSamrat.github.io/date-wiz-docs/api/format/)

---

### `getRelativeTime()` — Relative time with i18n

```ts
import { getRelativeTime } from "date-wiz";

getRelativeTime(fiveMinutesAgo); // "5 minutes ago"
getRelativeTime(fiveMinutesAgo, { precision: 2 }); // "5 minutes, 30 seconds ago"
getRelativeTime(fiveMinutesAgo, { locale: "fr" }); // "il y a 5 minutes"
getRelativeTime(fiveMinutesAgo, { locale: "bn-BD" }); // "৫ মিনিট আগে"
getRelativeTime(nextWeek); // "in 7 days"
```

→ [Full options reference](https://GourangaDasSamrat.github.io/date-wiz-docs/api/relative/)

---

### `smartFormat()` — Context-aware labels

Automatically picks the most human-readable format:

| Date               | Output                    |
| ------------------ | ------------------------- |
| Today              | `"Today at 4:30 PM"`      |
| Yesterday          | `"Yesterday at 11:00 AM"` |
| Within last 6 days | `"Wednesday at 2:00 PM"`  |
| This year          | `"Oct 12"`                |
| Past years         | `"Oct 12, 2022"`          |

→ [Full reference](https://GourangaDasSamrat.github.io/date-wiz-docs/api/smart-format/)

---

### `parse()` — Intelligent parsing

No format string needed — date-wiz figures it out:

```ts
import { parse } from "date-wiz";

parse("20240515"); // compact YYYYMMDD
parse("15-05-2024"); // regional DD-MM-YYYY
parse("May 15, 2024"); // natural language
parse("+2d"); // 2 days from now
parse("-1w"); // 1 week ago
parse("next_monday"); // next Monday
parse("last_friday"); // last Friday
```

→ [All supported formats](https://GourangaDasSamrat.github.io/date-wiz-docs/api/parse/)

---

### Business day utilities

```ts
import {
  addBusinessDays,
  countBusinessDays,
  isWithinWorkingHours,
} from "date-wiz";

// Skip weekends + holidays automatically
addBusinessDays(new Date(), 5, { holidays: ["2026-12-25"] });

// SLA working hours check
isWithinWorkingHours(new Date(), { start: "09:00", end: "18:00" });

// Count business days between two dates
countBusinessDays(startDate, endDate, { holidays: ["2026-12-25"] });
```

→ [Business day guide](https://GourangaDasSamrat.github.io/date-wiz-docs/guides/business-days/)

---

### Arithmetic utilities

```ts
import { add, subtract, diff, startOf, endOf, isBefore } from "date-wiz";

add(date, 3, "days"); // immutable — returns new Date
subtract(date, 2, "hours");
diff(dateA, dateB, "days"); // → 14
startOf(date, "month"); // → 2026-03-01T00:00:00.000
endOf(date, "day"); // → 2026-03-15T23:59:59.999
isBefore(dateA, dateB); // → boolean
```

→ [Arithmetic reference](https://GourangaDasSamrat.github.io/date-wiz-docs/api/arithmetic/)

---

## Tree-shaking

Import from sub-paths for the smallest possible bundle:

```ts
import { format } from "date-wiz/format"; // ~1.2 KB
import { getRelativeTime } from "date-wiz/relative"; // ~1.4 KB
import { addBusinessDays } from "date-wiz/business"; // ~1.2 KB
import { parse } from "date-wiz/parse"; // ~1.5 KB
```

→ [Tree-shaking guide](https://GourangaDasSamrat.github.io/date-wiz-docs/guides/tree-shaking/)

---

## Error handling

date-wiz never throws. Every function returns a configurable fallback on invalid input:

```ts
format("bad", "YYYY"); // "Invalid Date"
format("bad", "YYYY", undefined, { fallback: "—" }); // "—"
parse("???"); // null
```

→ [Error handling guide](https://GourangaDasSamrat.github.io/date-wiz-docs/guides/error-handling/)

---

## Documentation

The README is intentionally concise. Everything you need is in the docs:

|                                                                                             |                                    |
| ------------------------------------------------------------------------------------------- | ---------------------------------- |
| 🚀 [Quick Start](https://GourangaDasSamrat.github.io/date-wiz-docs/guides/quick-start/)     | Up and running in 2 minutes        |
| 📐 [API Reference](https://GourangaDasSamrat.github.io/date-wiz-docs/api/format/)           | Every function, option, and type   |
| 🌍 [i18n Guide](https://GourangaDasSamrat.github.io/date-wiz-docs/guides/i18n/)             | 100+ locales, zero locale files    |
| 🏢 [Business Days](https://GourangaDasSamrat.github.io/date-wiz-docs/guides/business-days/) | SLA logic, holiday exclusions      |
| ⚛️ [React Examples](https://GourangaDasSamrat.github.io/date-wiz-docs/examples/react/)      | Hooks, components, patterns        |
| ▲ [Next.js Examples](https://GourangaDasSamrat.github.io/date-wiz-docs/examples/nextjs/)    | RSC, client components, API routes |
| 🏗️ [Architecture](https://GourangaDasSamrat.github.io/date-wiz-docs/guides/architecture/)   | How it's built and why             |

---

## Contributing

**We ❤️ contributions!** Whether you're fixing a bug, adding a feature, improving documentation, or just asking questions — you're helping make date-wiz better.

### Quick Start

```bash
git clone https://github.com/GourangaDasSamrat/date-wiz.git
cd date-wiz
npm install
npm test        # 107 tests across 7 suites
npm run build   # ESM + CJS + types
npm test -- --watch  # watch mode during development
```

### Get Involved

- **Found a bug?** [Open a bug report](https://github.com/GourangaDasSamrat/date-wiz/issues/new?template=bug_report.yml) — include version, Node version, and minimal reproduction code
- **Have a feature idea?** [Suggest an enhancement](https://github.com/GourangaDasSamrat/date-wiz/issues/new?template=feature_request.yml) — describe the problem, proposed API, and whether it needs new dependencies
- **Questions or feedback?** [Start a discussion](https://github.com/GourangaDasSamrat/date-wiz/discussions) or open a [question issue](https://github.com/GourangaDasSamrat/date-wiz/issues/new?template=question.md)
- **Documentation unclear?** [Report a docs issue](https://github.com/GourangaDasSamrat/date-wiz/issues/new?template=documentation.yml)

### Before You Start

1. Read the [CONTRIBUTING.md](./docs/CONTRIBUTING.md) guide — it covers:
   - Development setup and workflow
   - Commit conventions (we use [Conventional Commits](https://www.conventionalcommits.org/))
   - Code style (TypeScript strict mode, immutability, single-purpose functions)
   - PR guidelines and review process

2. Check the [Code of Conduct](./docs/CODE_OF_CONDUCT.md) — we're committed to providing a welcoming, harassment-free environment

3. Verify existing issues/discussions — your idea might already be under discussion

### PR Checklist

- [ ] Tests added/updated and passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] TypeScript strict mode: no `any`, no unsafe non-null assertions
- [ ] No new runtime dependencies (discuss in an issue first if needed)
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] Documentation updated (README, ARCHITECTURE, etc. if applicable)
- [ ] Used the [PR template](./.github/pull_request_template.md)

### Architecture

Want to understand how date-wiz is organized? See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for a complete breakdown of modules, patterns, and design decisions.

### Questions?

- Open a [GitHub Discussion](https://github.com/GourangaDasSamrat/date-wiz/discussions)
- Check the [FAQ](https://GourangaDasSamrat.github.io/date-wiz-docs/faq/)
- Email: [see GitHub profile](https://github.com/GourangaDasSamrat)

---

## License

[MIT](./LICENSE) © [GourangaDasSamrat](https://github.com/GourangaDasSamrat)
