// tests/arithmetic.test.ts
import { add, subtract, diff, isBefore, isAfter, isSameDay, clampDate, startOf, endOf } from '../src/arithmetic.js';

const BASE = new Date('2024-06-15T12:00:00.000Z');

describe('add()', () => {
  test('adds milliseconds', () => {
    expect(add(BASE, 500, 'ms').getTime()).toBe(BASE.getTime() + 500);
  });
  test('adds seconds', () => {
    expect(add(BASE, 30, 's').getTime()).toBe(BASE.getTime() + 30_000);
  });
  test('adds minutes', () => {
    expect(add(BASE, 5, 'm').getTime()).toBe(BASE.getTime() + 300_000);
  });
  test('adds hours', () => {
    expect(add(BASE, 2, 'h').getTime()).toBe(BASE.getTime() + 7_200_000);
  });
  test('adds days', () => {
    const result = add(BASE, 3, 'd');
    expect(result.getTime()).toBe(BASE.getTime() + 3 * 86_400_000);
  });
  test('adds weeks', () => {
    const result = add(BASE, 2, 'w');
    expect(result.getTime()).toBe(BASE.getTime() + 14 * 86_400_000);
  });
  test('adds months', () => {
    const result = add(new Date('2024-01-31'), 1, 'M');
    expect([1, 2]).toContain(result.getMonth()); // JS may overflow Jan 31 + 1M to Mar
  });
  test('adds years', () => {
    const result = add(BASE, 1, 'y');
    expect(result.getFullYear()).toBe(2025);
  });
  test('does not mutate original', () => {
    const orig = new Date(BASE.getTime());
    add(BASE, 5, 'd');
    expect(BASE.getTime()).toBe(orig.getTime());
  });
});

describe('subtract()', () => {
  test('subtracts days', () => {
    const result = subtract(BASE, 3, 'd');
    expect(result.getTime()).toBe(BASE.getTime() - 3 * 86_400_000);
  });
  test('subtracts years', () => {
    const result = subtract(BASE, 2, 'y');
    expect(result.getFullYear()).toBe(2022);
  });
});

describe('diff()', () => {
  test('diff in milliseconds', () => {
    const a = new Date(2000);
    const b = new Date(1000);
    expect(diff(a, b, 'ms')).toBe(1000);
  });
  test('diff in days', () => {
    const a = new Date('2024-01-10');
    const b = new Date('2024-01-07');
    expect(diff(a, b, 'd')).toBeCloseTo(3);
  });
  test('negative diff when b > a', () => {
    const a = new Date('2024-01-07');
    const b = new Date('2024-01-10');
    expect(diff(a, b, 'd')).toBeCloseTo(-3);
  });
});

describe('isBefore() / isAfter()', () => {
  const past   = new Date('2020-01-01');
  const future = new Date('2030-01-01');
  test('isBefore', () => expect(isBefore(past, future)).toBe(true));
  test('isAfter',  () => expect(isAfter(future, past)).toBe(true));
  test('isBefore false when after', () => expect(isBefore(future, past)).toBe(false));
});

describe('isSameDay()', () => {
  test('same day returns true', () => {
    expect(isSameDay(new Date('2024-05-15T08:00:00'), new Date('2024-05-15T22:00:00'))).toBe(true);
  });
  test('different day returns false', () => {
    expect(isSameDay(new Date('2024-05-15'), new Date('2024-05-16'))).toBe(false);
  });
});

describe('clampDate()', () => {
  const min = new Date('2024-01-01');
  const max = new Date('2024-12-31');
  test('clamps below min', () => {
    expect(clampDate(new Date('2023-06-01'), min, max).getFullYear()).toBe(2024);
  });
  test('clamps above max', () => {
    expect(clampDate(new Date('2025-06-01'), min, max).getFullYear()).toBe(2024);
  });
  test('passes through in-range date', () => {
    const d = new Date('2024-06-15');
    expect(clampDate(d, min, max).getMonth()).toBe(5); // June
  });
});

describe('startOf()', () => {
  test('startOf day', () => {
    const result = startOf(new Date('2024-05-15T14:30:45'), 'day');
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });
  test('startOf month', () => {
    const result = startOf(new Date('2024-05-15'), 'month');
    expect(result.getDate()).toBe(1);
  });
  test('startOf year', () => {
    const result = startOf(new Date('2024-05-15'), 'year');
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
  });
});

describe('endOf()', () => {
  test('endOf day is 23:59:59.999', () => {
    const result = endOf(new Date('2024-05-15'), 'day');
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
  });
});
