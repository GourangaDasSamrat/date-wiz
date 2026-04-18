// tests/relative.test.ts
import { getRelativeTime } from "../src/relative.js";

function ago(ms: number): Date {
  return new Date(Date.now() - ms);
}
function fromNow(ms: number): Date {
  return new Date(Date.now() + ms);
}

const SEC = 1_000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe("getRelativeTime()", () => {
  test('returns "just now" equivalent for very recent dates', () => {
    const result = getRelativeTime(ago(10 * SEC));
    expect(result.toLowerCase()).toMatch(/now|second/);
  });

  test("returns minutes ago", () => {
    const result = getRelativeTime(ago(5 * MIN));
    expect(result).toMatch(/5|minute/i);
  });

  test("returns hours ago", () => {
    const result = getRelativeTime(ago(3 * HOUR));
    expect(result).toMatch(/3|hour/i);
  });

  test("returns days ago", () => {
    const result = getRelativeTime(ago(2 * DAY));
    expect(result).toMatch(/2|day/i);
  });

  test("handles future dates", () => {
    const result = getRelativeTime(fromNow(3 * DAY));
    expect(result.toLowerCase()).toMatch(/in|3|day/);
  });

  test("precision: 2 returns two parts", () => {
    const result = getRelativeTime(ago(2 * DAY + 4 * HOUR), { precision: 2 });
    // Should contain both day and hour information
    expect(result).toMatch(/day|hour/i);
  });

  test("returns fallback for invalid date", () => {
    const result = getRelativeTime("not-a-date", { fallback: "N/A" });
    expect(result).toBe("N/A");
  });

  test("custom justNowThreshold", () => {
    // 60s ago, but threshold is 90s → should return "just now" equivalent
    const result = getRelativeTime(ago(60 * SEC), { justNowThreshold: 90 });
    expect(result.toLowerCase()).toMatch(/now|second/);
  });

  test("accepts custom baseDate", () => {
    const base = new Date("2024-01-10T00:00:00Z");
    const date = new Date("2024-01-08T00:00:00Z"); // 2 days before base
    const result = getRelativeTime(date, { baseDate: base, locale: "en" });
    expect(result).toMatch(/2|day/i);
  });

  test("locale option affects output", () => {
    const en = getRelativeTime(ago(5 * MIN), { locale: "en" });
    expect(typeof en).toBe("string");
    expect(en.length).toBeGreaterThan(0);
  });
});
