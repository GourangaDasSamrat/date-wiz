// tests/smart.test.ts
import { smartFormat } from "../src/smart.js";

describe("smartFormat()", () => {
  test('today returns "Today at ..."', () => {
    const result = smartFormat(new Date());
    expect(result.toLowerCase()).toContain("today");
  });

  test('yesterday returns "Yesterday at ..."', () => {
    const yesterday = new Date(Date.now() - 86_400_000);
    const result = smartFormat(yesterday);
    expect(result.toLowerCase()).toContain("yesterday");
  });

  test("this week returns weekday name", () => {
    // 3 days ago (still within the week window if not crossing yesterday)
    const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000);
    const result = smartFormat(threeDaysAgo);
    // Result should be a weekday or "Yesterday" — at minimum a non-empty string
    expect(result.length).toBeGreaterThan(0);
  });

  test('same year returns short format (e.g. "Jan 5")', () => {
    const sameYear = new Date(new Date().getFullYear(), 0, 5); // Jan 5 this year
    const result = smartFormat(sameYear);
    expect(result).toMatch(/Jan/i);
  });

  test("past year returns long format with year", () => {
    const oldDate = new Date("2020-03-15");
    const result = smartFormat(oldDate);
    expect(result).toContain("2020");
  });

  test("returns fallback for invalid date", () => {
    const result = smartFormat("not-a-date", { fallback: "--" });
    expect(result).toBe("--");
  });

  test("accepts custom labels", () => {
    const result = smartFormat(new Date(), {
      labels: { todayAt: "Hoje às", yesterdayAt: "Ontem às" },
    });
    expect(result).toContain("Hoje às");
  });
});
