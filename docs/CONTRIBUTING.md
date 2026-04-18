# Contributing to date-wiz

Thank you for taking the time to contribute! This document covers everything you need to get from zero to a merged pull request.

> **New to this project?** Start with the [README](../README.md#contributing) to understand the project, then refer back to this guide for detailed workflow instructions.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Code Style](#code-style)
- [Questions?](#questions)

---

## Getting Started

**Prerequisites:** Node.js ≥ 18, npm ≥ 9

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/date-wiz.git
cd date-wiz

# 2. Install dev dependencies (zero runtime deps, dev-only)
npm install

# 3. Run the full test suite to confirm everything is green
npm test

# 4. Build to confirm the TypeScript compiles cleanly
npm run build
```

**Stuck?** Open a [discussion](https://github.com/GourangaDasSamrat/date-wiz/discussions) — we're happy to help!

---

## Development Workflow

```bash
npm test              # run all 107 tests
npm test -- --watch   # watch mode during development
npm run build         # compile ESM + CJS + types
npm test -- --coverage  # view coverage report
```

All source code lives in `src/`. Tests live in `tests/` and mirror the source file names. See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for a complete breakdown of the module structure.

### Key Rules

1. **Every new public function must have a corresponding test** in `tests/`
2. **Never import external packages** — date-wiz has zero runtime dependencies by design
3. **Always clone the input date before mutating it** — use `clone()` from `utils.ts`
4. **All functions must accept an invalid date without throwing** — use the `fallback` pattern
5. **TypeScript strict mode always** — no `any`, no unsafe non-null assertions

### File Structure

```
src/
├── index.ts                # Public exports only
├── wiz.ts                  # Chainable API
├── format.ts               # Token-based formatting
├── parse.ts                # Intelligent date parsing
├── relative.ts             # getRelativeTime
├── smart.ts                # smartFormat
├── business.ts             # Business day utilities
├── arithmetic.ts           # add, subtract, diff, etc.
├── types.ts                # TypeScript types
└── utils.ts                # Internal helpers (not exported)

tests/
├── wiz.test.ts             # Mirrors src/wiz.ts
├── format.test.ts
├── parse.test.ts
└── ...

docs/
├── ARCHITECTURE.md         # Design decisions and module breakdown
├── CONTRIBUTING.md         # You are here!
├── CODE_OF_CONDUCT.md      # Community standards
└── SECURITY.md             # Security policy
```

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

Optional body describing the change.

Optional footer: Closes #123
```

### Commit Types

| Type       | When to use                                     | Example                                               |
| ---------- | ----------------------------------------------- | ----------------------------------------------------- |
| `feat`     | A new user-facing feature                       | `feat(parse): add MM/DD/YYYY locale format`           |
| `fix`      | A bug fix                                       | `fix(relative): handle precision:3 with future dates` |
| `docs`     | Documentation only                              | `docs: add smartFormat examples to README`            |
| `refactor` | Code change that is neither a fix nor a feature | `refactor(utils): extract date cloning logic`         |
| `test`     | Adding or updating tests                        | `test(format): add edge cases for timezone offsets`   |
| `chore`    | Build process, CI, or tooling changes           | `chore: update dev dependencies`                      |
| `perf`     | Performance improvement                         | `perf(parse): optimize regex matching`                |

### Examples

```
feat(business): add isWithinWorkingHours function

Allows checking if a date falls within working hours.
Supports custom start/end times and timezone handling.

Closes #45
```

```
fix(relative): handle precision parameter correctly with edge times

Previously, precision:2 would sometimes round incorrectly
when the second time unit was at 59 seconds.

Closes #123
```

### Scope Guidelines

Use the module name as the scope: `format`, `parse`, `wiz`, `business`, `relative`, `smart`, `arithmetic`, `types`, `utils`.

If your change affects multiple modules, you can:

- Use a generic scope like `feat(core): ...` or `fix(multiple): ...`
- Split into multiple commits with different scopes

---

## Pull Request Guidelines

### Before You Start

1. **Check existing issues/PRs** — your idea might already be in progress
2. **For major features**, [open an issue](https://github.com/GourangaDasSamrat/date-wiz/issues) or [discussion](https://github.com/GourangaDasSamrat/date-wiz/discussions) first to discuss the approach
3. **Read the [Code of Conduct](./CODE_OF_CONDUCT.md)** — we're committed to a welcoming community

### During Development

1. **Branch off `main`** — use a descriptive branch name:
   - Feature: `feat/duration-humanize` or `feat/business-hour-checking`
   - Fix: `fix/parse-timezone` or `fix/arc-business-days-edge-case`
   - Docs: `docs/add-faq`

2. **Keep your branch up to date** — rebase on `main` if needed before opening the PR

3. **One PR per concern** — keep changes focused; avoid mixing features, refactors, and doc updates unless they're closely related

4. **Use the PR template** — it's there to help! located at [.github/pull_request_template.md](./.github/pull_request_template.md)

### Before Submitting

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run build` (compiles to ESM, CJS, and types)
- [ ] No new runtime dependencies (discuss in an issue first if needed)
- [ ] Commit messages follow [Conventional Commits](#commit-convention)
- [ ] Updated documentation:
  - README.md if API changes
  - docs/ARCHITECTURE.md if architecture changes
  - Inline JSDoc comments for complex logic
- [ ] Coverage hasn't decreased

### After Submitting

- **Respond to feedback** — maintainers may ask for changes, clarifications, or rebasing
- **Rebase if requested** — keep commits clean and easy to review
- **All CI checks must pass** — we test on Node 18, 20, and 22

### Merge Requirements

✅ Required:

- All tests passing (Node 18, 20, 22)
- No TypeScript errors
- At least one maintainer approval
- Conventional Commits format
- Updated documentation (if applicable)

❌ Blocking:

- New runtime dependencies (without discussion)
- Decreased test coverage
- Breaking changes without migration guide

---

## Reporting Bugs

Found a bug? Please [open a bug report](https://github.com/GourangaDasSamrat/date-wiz/issues/new?template=bug_report.yml).

Include:

- **date-wiz version** — run `npm list date-wiz`
- **Node.js version** — run `node -v`
- **Affected function(s)** — which function(s) have the issue?
- **Minimal reproduction code** — the smallest snippet that reproduces the problem
- **Expected vs. actual behavior** — what should happen vs. what actually happens
- **Environment info** — OS, browser (if applicable), etc.

### Security Vulnerabilities

**Do not** open a public issue for security vulnerabilities. Instead, email the maintainer or use GitHub's private vulnerability reporting. See [SECURITY.md](./SECURITY.md).

---

## Suggesting Features

Have an idea? [Open a feature request](https://github.com/GourangaDasSamrat/date-wiz/issues/new?template=feature_request.yml) or start a [discussion](https://github.com/GourangaDasSamrat/date-wiz/discussions).

When proposing a feature, describe:

- **Problem** — what pain point does this solve?
- **Proposed API** — what would the function signature look like?
- **Alternatives** — are there other ways to solve this?
- **Dependencies** — can it be done without adding external packages?

### Design Principles

We evaluate features based on:

1. **Scope** — does it fit within date-wiz's purpose (date utilities)?
2. **Bundle size** — does it meaningfully impact the ~2 KB target?
3. **Dependency-free** — zero dependencies is a core value
4. **Immutability** — all operations return new values, never mutate input
5. **Type safety** — full TypeScript support
6. **Internationalization** — uses native `Intl` API
7. **Error handling** — never throws, uses fallback pattern

---

## Code Style

### TypeScript & JavaScript

```ts
// ✅ Good
const getDateDifference = (dateA: Date, dateB: Date): number => {
  const clonedDate = clone(dateA);
  return clonedDate.getTime() - dateB.getTime();
};

// ❌ Avoid
function getDateDifference(dateA: any, dateB: any) {
  return dateA.getTime() - dateB.getTime(); // mutates? unclear
}
```

**Rules:**

- **TypeScript strict mode is always on** — no `any` types, no unsafe non-null assertions (`!`)
- **Prefer `const` over `let`; never use `var`**
- **Use named exports only** — no default exports in `src/`
- **Keep functions small and single-purpose** — extract helpers to `utils.ts` if reused
- **Internal helpers are not exported** from `index.ts`
- **Always clone dates before mutating** — use `clone()` from `utils.ts`
- **Always handle invalid dates gracefully** — return fallback, never throw

### Testing

```ts
// ✅ Good — clear, focused, descriptive
describe("format", () => {
  it("should format a valid date with YYYY-MM-DD token", () => {
    const date = new Date("2026-03-15T10:30:45");
    expect(format(date, "YYYY-MM-DD")).toBe("2026-03-15");
  });

  it("should return fallback for invalid input", () => {
    expect(format("invalid", "YYYY")).toBe("Invalid Date");
    expect(format("bad", "YYYY", undefined, { fallback: "N/A" })).toBe("N/A");
  });
});
```

**Testing Guidelines:**

- Test happy paths and edge cases
- Test with valid and invalid input
- Test with different locales (at least 'en' and 'bn-BD')
- Test with timezone-sensitive operations
- Keep tests concise — one assertion per test when possible
- Use descriptive test names (`should handle X, not test 123`)

### Documentation & Comments

```ts
/**
 * Formats a date using token-based formatting.
 * @param date - The date to format
 * @param format - Format string with tokens like YYYY, MM, DD
 * @param locale - BCP 47 locale code (default: 'en')
 * @param options - Optional { fallback: string }
 * @returns Formatted date string
 * @example
 * format(new Date(), 'DD MMMM YYYY'); // "15 March 2026"
 * format('invalid', 'YYYY', undefined, { fallback: 'N/A' }); // "N/A"
 */
export const format = (
  date: Date | string | null | undefined,
  formatStr: string,
  locale?: string,
  options?: { fallback?: string },
): string => {
  // implementation
};
```

- **JSDoc comments** for all public functions and exports
- **Inline comments** for complex logic (explain _why_, not _what_)
- **No console.log** in production code (tests are OK for debugging)

### Imports

```ts
// ✅ Good — explicit, organized
import { clone } from "./utils";
import { type DateUnit } from "./types";

// ❌ Avoid — internal helpers shouldn't be exported
import { internalHelper } from "date-wiz"; // doesn't exist!
```

---

## Resources

- 📖 [Architecture Guide](./docs/ARCHITECTURE.md) — understand the codebase structure
- 🧪 [Jest Documentation](https://jestjs.io/) — testing framework we use
- ✍️ [Conventional Commits](https://www.conventionalcommits.org/) — commit format
- 🌐 [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) — Date API reference
- 🔧 [TypeScript Handbook](https://www.typescriptlang.org/docs/) — TypeScript best practices

---

## Questions?

- 💬 [GitHub Discussions](https://github.com/GourangaDasSamrat/date-wiz/discussions) — ask the community
- 🐛 [GitHub Issues](https://github.com/GourangaDasSamrat/date-wiz/issues) — report bugs or request features
- 📧 **Email** — see [GitHub profile](https://github.com/GourangaDasSamrat)

---

**Thank you for contributing to date-wiz! Every contribution — code, tests, docs, or feedback — helps make this library better for everyone.** 🎉
