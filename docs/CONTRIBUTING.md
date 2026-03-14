# Contributing to date-wiz

Thank you for taking the time to contribute! This document covers everything you need to get from zero to a merged pull request.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Code Style](#code-style)

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

---

## Development Workflow

```bash
npm test              # run all 107 tests
npm test -- --watch   # watch mode during development
npm run build         # compile ESM + CJS + types
npm test -- --coverage  # view coverage report
```

All source lives in `src/`. Tests live in `tests/` and mirror the source file names. See [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) for a full breakdown of the module structure.

**Key rules:**

- Every new public function must have a corresponding test in `tests/`.
- Never import external packages — `date-wiz` has zero runtime dependencies by design.
- Always clone the input date before mutating it (`clone()` from `utils.ts`).
- All functions must accept an invalid date without throwing — use the `fallback` pattern.

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

| Type | When to use |
|---|---|
| `feat` | A new user-facing feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that is neither a fix nor a feature |
| `test` | Adding or updating tests |
| `chore` | Build process, CI, or tooling changes |
| `perf` | Performance improvement |

**Examples:**

```
feat(parse): support MM/DD/YYYY locale format
fix(relative): handle precision:3 with future dates
docs: add smartFormat examples to README
chore: rename post-build.js to post-build.mjs
```

---

## Pull Request Guidelines

1. **Branch off `main`** — use a short, descriptive branch name: `feat/duration-humanize`, `fix/parse-timezone`.
2. **One PR per concern** — keep changes focused; avoid mixing features and refactors.
3. **All checks must pass** — CI runs tests on Node 18, 20, and 22. All three must be green.
4. **Update documentation** — if you change a public API, update `README.md`. If you change the architecture, update `docs/ARCHITECTURE.md`.
5. **No new runtime dependencies** — if you believe one is genuinely needed, open an issue to discuss it first.

---

## Reporting Bugs

Please [open an issue](https://github.com/GourangaDasSamrat/date-wiz/issues/new) and include:

- `date-wiz` version (`npm list date-wiz`)
- Node.js version (`node -v`)
- A minimal code snippet that reproduces the problem
- The output you expected vs. what you actually got

For security vulnerabilities, **do not open a public issue** — see [`docs/SECURITY.md`](./SECURITY.md) instead.

---

## Suggesting Features

Open a [GitHub Discussion](https://github.com/GourangaDasSamrat/date-wiz/discussions) or an issue labelled `enhancement`. Describe:

- The problem you are trying to solve
- Your proposed API (function signature, options shape)
- Whether it can be achieved without adding a runtime dependency

---

## Code Style

- TypeScript strict mode is always on — no `any`, no non-null assertions without justification.
- Prefer `const` over `let`; never use `var`.
- Use named exports only — no default exports in `src/`.
- Keep functions small and single-purpose; extract helpers into `utils.ts` when they are reused.
- Internal helpers that are not part of the public API must not be exported from `index.ts`.

There is no linter configured yet — consistent style is enforced through code review.
