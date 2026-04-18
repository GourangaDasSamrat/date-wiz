// tests/format.test.ts
import { format } from "../src/format.js";

const FIXED = new Date("2024-05-15T14:30:07.000Z");

describe("format()", () => {
  test("YYYY returns 4-digit year", () => {
    expect(format(FIXED, "YYYY")).toMatch(/^\d{4}$/);
  });

  test("YY returns 2-digit year", () => {
    expect(format(FIXED, "YY")).toMatch(/^\d{2}$/);
  });

  test("MM returns zero-padded month", () => {
    const result = format(new Date("2024-01-15"), "MM");
    expect(result).toBe("01");
  });

  test("DD returns zero-padded day", () => {
    const result = format(new Date("2024-05-05"), "DD");
    expect(result).toBe("05");
  });

  test("D returns day without padding", () => {
    const result = format(new Date("2024-05-05"), "D");
    expect(result).toBe("5");
  });

  test("x returns unix milliseconds", () => {
    const d = new Date(1_000_000);
    expect(format(d, "x")).toBe("1000000");
  });

  test("X returns unix seconds", () => {
    const d = new Date(1_000_000);
    expect(format(d, "X")).toBe("1000");
  });

  test("LLL returns locale long string", () => {
    const result = format(new Date("2024-01-01"), "LLL", "en");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  test("LL returns locale medium string", () => {
    const result = format(new Date("2024-01-01"), "LL", "en");
    expect(result).toBeTruthy();
  });

  test("L returns locale short string", () => {
    const result = format(new Date("2024-01-01"), "L", "en");
    expect(result).toBeTruthy();
  });

  test("LT returns locale time string", () => {
    const result = format(new Date("2024-01-01T10:30:00"), "LT", "en");
    expect(result).toBeTruthy();
  });

  test("A returns AM or PM", () => {
    expect(["AM", "PM"]).toContain(format(FIXED, "A"));
  });

  test("a returns am or pm", () => {
    expect(["am", "pm"]).toContain(format(FIXED, "a"));
  });

  test("invalid date returns fallback", () => {
    expect(format("not-a-date", "YYYY", undefined, { fallback: "N/A" })).toBe(
      "N/A",
    );
  });

  test('invalid date returns "Invalid Date" by default', () => {
    expect(format("bad", "YYYY")).toBe("Invalid Date");
  });

  test("preserves literal characters in format string", () => {
    const result = format(new Date("2024-05-15"), "YYYY/MM/DD");
    expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
  });

  test("MMMM returns full month name (en)", () => {
    const result = format(new Date("2024-01-15"), "MMMM", "en");
    expect(result).toBe("January");
  });

  test("MMM returns short month name (en)", () => {
    const result = format(new Date("2024-01-15"), "MMM", "en");
    expect(result).toBe("Jan");
  });

  test("accepts number timestamp", () => {
    const ts = new Date("2024-05-15").getTime();
    const result = format(ts, "YYYY");
    expect(result).toMatch(/^\d{4}$/);
  });
});
