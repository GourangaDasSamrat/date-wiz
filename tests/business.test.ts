// tests/business.test.ts
import {
  addBusinessDays,
  subtractBusinessDays,
  countBusinessDays,
  isWithinWorkingHours,
  checkIsBusinessDay,
} from "../src/business.js";

// Monday 2024-01-08
const MONDAY = new Date("2024-01-08T10:00:00");
// Friday 2024-01-12
const FRIDAY = new Date("2024-01-12T10:00:00");
// Saturday 2024-01-13
const SATURDAY = new Date("2024-01-13T10:00:00");

describe("addBusinessDays()", () => {
  test("adds 5 business days from Monday → Monday", () => {
    const result = addBusinessDays(MONDAY, 5);
    // Mon Jan 8 + 5 business days = Mon Jan 15
    expect(result.getDay()).toBe(1); // Monday
    expect(result.getDate()).toBe(15);
  });

  test("adds 1 business day from Friday → Monday", () => {
    const result = addBusinessDays(FRIDAY, 1);
    expect(result.getDay()).toBe(1); // Monday
  });

  test("skips holidays", () => {
    // Jan 9 (Tue) is a holiday; adding 1 from Mon Jan 8 should land on Wed Jan 10
    const result = addBusinessDays(MONDAY, 1, { holidays: ["2024-01-09"] });
    expect(result.getDate()).toBe(10);
  });

  test("handles negative days (subtraction)", () => {
    const result = addBusinessDays(MONDAY, -1);
    expect(result.getDay()).toBe(5); // Friday
  });

  test("returns Invalid Date unchanged", () => {
    const result = addBusinessDays("bad", 5);
    expect(isNaN(result.getTime())).toBe(true);
  });
});

describe("subtractBusinessDays()", () => {
  test("subtracts 1 business day from Monday → Friday", () => {
    const result = subtractBusinessDays(MONDAY, 1);
    expect(result.getDay()).toBe(5);
  });
});

describe("countBusinessDays()", () => {
  test("counts 5 business days in a work week", () => {
    const start = new Date("2024-01-08"); // Mon
    const end = new Date("2024-01-12"); // Fri
    expect(countBusinessDays(start, end)).toBe(4); // exclusive start
  });

  test("excludes weekends", () => {
    const start = new Date("2024-01-08"); // Mon
    const end = new Date("2024-01-15"); // Mon next week
    expect(countBusinessDays(start, end)).toBe(5);
  });

  test("excludes holidays", () => {
    const start = new Date("2024-01-08");
    const end = new Date("2024-01-12");
    const count = countBusinessDays(start, end, { holidays: ["2024-01-09"] });
    expect(count).toBe(3); // Tue excluded
  });

  test("returns negative when from > to", () => {
    const start = new Date("2024-01-12");
    const end = new Date("2024-01-08");
    expect(countBusinessDays(start, end)).toBeLessThan(0);
  });
});

describe("isWithinWorkingHours()", () => {
  test("returns true for time within working hours on a weekday", () => {
    const d = new Date("2024-01-08T10:00:00"); // Monday 10am
    expect(isWithinWorkingHours(d, { start: "09:00", end: "17:00" })).toBe(
      true,
    );
  });

  test("returns false for time outside working hours", () => {
    const d = new Date("2024-01-08T08:00:00"); // Monday 8am
    expect(isWithinWorkingHours(d, { start: "09:00", end: "17:00" })).toBe(
      false,
    );
  });

  test("returns false on weekends", () => {
    const d = new Date("2024-01-13T10:00:00"); // Saturday
    expect(isWithinWorkingHours(d)).toBe(false);
  });

  test("returns false at end boundary (exclusive)", () => {
    const d = new Date("2024-01-08T17:00:00"); // exactly 5pm
    expect(isWithinWorkingHours(d, { start: "09:00", end: "17:00" })).toBe(
      false,
    );
  });
});

describe("checkIsBusinessDay()", () => {
  test("Monday is a business day", () => {
    expect(checkIsBusinessDay(MONDAY)).toBe(true);
  });

  test("Saturday is not a business day", () => {
    expect(checkIsBusinessDay(SATURDAY)).toBe(false);
  });

  test("holiday is not a business day", () => {
    expect(checkIsBusinessDay(MONDAY, { holidays: ["2024-01-08"] })).toBe(
      false,
    );
  });
});
