// tests/wiz.test.ts
import { wiz } from "../src/wiz.js";

describe("wiz() chainable factory", () => {
  test("wraps current date when called with no args", () => {
    const w = wiz();
    expect(w.date).toBeInstanceOf(Date);
    expect(Math.abs(w.date.getTime() - Date.now())).toBeLessThan(100);
  });

  test("wraps a Date input", () => {
    const d = new Date("2024-05-15");
    const w = wiz(d);
    expect(w.date.getFullYear()).toBe(2024);
  });

  test("wraps a timestamp number", () => {
    const ts = new Date("2024-05-15").getTime();
    const w = wiz(ts);
    expect(w.date.getFullYear()).toBe(2024);
  });

  test(".add() returns new WizInstance", () => {
    const w1 = wiz(new Date("2024-01-01"));
    const w2 = w1.add(5, "d");
    expect(w2.date.getDate()).toBe(6);
    // Immutability: w1 unchanged
    expect(w1.date.getDate()).toBe(1);
  });

  test(".subtract() returns new WizInstance", () => {
    const w = wiz(new Date("2024-01-10")).subtract(5, "d");
    expect(w.date.getDate()).toBe(5);
  });

  test(".setHour() returns new WizInstance", () => {
    const w = wiz(new Date("2024-01-10T12:00:00")).setHour(17);
    expect(w.date.getHours()).toBe(17);
  });

  test(".setMinute() returns new WizInstance", () => {
    const w = wiz(new Date("2024-01-10T12:00:00")).setMinute(45);
    expect(w.date.getMinutes()).toBe(45);
  });

  test(".format() returns a string", () => {
    const result = wiz(new Date("2024-05-15")).format("YYYY-MM-DD");
    expect(typeof result).toBe("string");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test(".smartFormat() returns a string", () => {
    const result = wiz().smartFormat();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test(".relative() returns a string", () => {
    const result = wiz(new Date(Date.now() - 60_000)).relative();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test(".toDate() returns plain Date", () => {
    const d = new Date("2024-05-15");
    const result = wiz(d).toDate();
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2024);
  });

  test(".toISO() returns ISO string", () => {
    const result = wiz(new Date("2024-05-15")).toISO();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test(".valueOf() returns ms timestamp", () => {
    const d = new Date("2024-05-15");
    expect(wiz(d).valueOf()).toBe(d.getTime());
  });

  test("method chaining works end-to-end", () => {
    const result = wiz(new Date("2024-01-01"))
      .add(3, "businessDays")
      .setHour(17)
      .format("YYYY-MM-DD HH:mm");
    expect(typeof result).toBe("string");
    expect(result).toMatch(/\d{4}-\d{2}-\d{2} 17:\d{2}/);
  });

  test("immutability: original wiz is not mutated by chain", () => {
    const w = wiz(new Date("2024-01-01"));
    const origTime = w.valueOf();
    w.add(100, "d").add(50, "h").setHour(22);
    expect(w.valueOf()).toBe(origTime);
  });
});
