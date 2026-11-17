import { describe, expect, it } from 'vitest';
import { columnCount, progressRange } from '../../src/geometry/values.js';

describe('column count', () => {
  it.each([
    [3, 3], [2.9, 2], [0, 1], [-4, 1], [20, 12], [Infinity, 2], [NaN, 2],
  ])('normalizes %s to %s', (input, expected) => {
    expect(columnCount(input)).toBe(expected);
  });
});

describe('progress range', () => {
  it.each([
    [60, 200, 60, 200],
    [-4, 100, 0, 100],
    [120, 100, 100, 100],
    [50, 0, 50, 100],
    [90, -3, 90, 100],
    [50, Infinity, 50, 100],
    [NaN, 50, 0, 50],
    [Infinity, 50, 0, 50],
    [0.25, 0.5, 0.25, 0.5],
  ])('normalizes %s / %s to %s / %s', (value, max, expectedValue, expectedMax) => {
    expect(progressRange(value, max)).toEqual({ value: expectedValue, max: expectedMax });
  });
});
