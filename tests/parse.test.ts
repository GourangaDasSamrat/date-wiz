// tests/parse.test.ts
import { parse } from "../src/parse.js";

describe("parse()", () => {
  test("parses ISO 8601 string", () => {
    const result = parse("2024-05-15");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2024);
  });

  test("parses compact YYYYMMDD", () => {
    const result = parse("20240515");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2024);
    expect(result!.getMonth()).toBe(4); // May = 4
    expect(result!.getDate()).toBe(15);
  });

  test("parses DD-MM-YYYY", () => {
    const result = parse("15-05-2024");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2024);
    expect(result!.getMonth()).toBe(4);
    expect(result!.getDate()).toBe(15);
  });

  test("parses YYYY-MM-DD", () => {
    const result = parse("2024-05-15");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2024);
  });

  test("parses +2d (2 days from now)", () => {
    const now = Date.now();
    const result = parse("+2d");
    expect(result).toBeInstanceOf(Date);
    const delta = result!.getTime() - now;
    expect(delta).toBeGreaterThan(1.9 * 86_400_000);
    expect(delta).toBeLessThan(2.1 * 86_400_000);
  });

  test("parses -1w (1 week ago)", () => {
    const now = Date.now();
    const result = parse("-1w");
    expect(result).toBeInstanceOf(Date);
    const delta = now - result!.getTime();
    expect(delta).toBeGreaterThan(0.9 * 7 * 86_400_000);
    expect(delta).toBeLessThan(1.1 * 7 * 86_400_000);
  });

  test("parses +3M (3 months from now)", () => {
    const result = parse("+3M");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getTime()).toBeGreaterThan(Date.now());
  });

  test("parses next_monday", () => {
    const result = parse("next_monday");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getDay()).toBe(1); // Monday
    expect(result!.getTime()).toBeGreaterThan(Date.now());
  });

  test("parses last_friday", () => {
    const result = parse("last_friday");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getDay()).toBe(5); // Friday
    expect(result!.getTime()).toBeLessThan(Date.now());
  });

  test("parses +2h (2 hours from now)", () => {
    const now = Date.now();
    const result = parse("+2h");
    expect(result).toBeInstanceOf(Date);
    const delta = result!.getTime() - now;
    expect(delta).toBeGreaterThan(1.9 * 3_600_000);
    expect(delta).toBeLessThan(2.1 * 3_600_000);
  });

  test("returns null for unparseable string", () => {
    const result = parse("not-a-date-at-all-xyz");
    expect(result).toBeNull();
  });

  test("passes through Date objects", () => {
    const d = new Date("2024-01-01");
    const result = parse(d);
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2024);
  });

  test("passes through number timestamps", () => {
    const ts = new Date("2024-01-01").getTime();
    const result = parse(ts);
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2024);
  });
});
