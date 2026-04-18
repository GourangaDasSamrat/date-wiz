# Security Policy

## Supported Versions

Only the latest published version on npm receives security fixes.

| Version        | Supported |
| -------------- | --------- |
| Latest (`1.x`) | ✅        |
| Older versions | ❌        |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in `date-wiz`, report it privately by emailing:

**gouranga.samrat@gmail.com**

Include the following in your report:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a minimal proof-of-concept
- The `date-wiz` version and Node.js version affected
- Any suggested mitigations, if you have them

---

## Response Timeline

| Stage                          | Target time                        |
| ------------------------------ | ---------------------------------- |
| Acknowledgement of your report | Within **48 hours**                |
| Confirmed / not confirmed      | Within **5 business days**         |
| Patch released (if confirmed)  | Within **14 days** of confirmation |

You will be credited in the release notes unless you request otherwise.

---

## Scope

`date-wiz` is a pure date utility library with **zero runtime dependencies**. It performs no network requests, reads no files, and executes no user-supplied strings as code. The attack surface is therefore narrow — the most realistic categories of vulnerability are:

- **ReDoS** — a crafted input string causing catastrophic regex backtracking in `format()` or `parse()`
- **Prototype pollution** — a crafted input mutating `Object.prototype` through options merging
- **Incorrect output** — logic errors in date arithmetic that could silently produce wrong results in security-sensitive contexts (e.g. SLA calculations, token expiry)

Reports in any of these categories are taken seriously.

---

## Out of Scope

The following are **not** considered security vulnerabilities for this project:

- Bugs in dev dependencies (Jest, TypeScript, ts-jest) — report those upstream
- Issues that only affect unsupported or end-of-life Node.js versions
- Theoretical vulnerabilities with no practical exploit path

---

## Disclosure Policy

This project follows [Coordinated Vulnerability Disclosure](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html). Please allow a reasonable time for a fix to be released before any public disclosure.
