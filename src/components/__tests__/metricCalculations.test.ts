import { describe, it, expect } from 'vitest';
import {
  extractValues,
  computeStats,
  safePercentile,
  buildHistogramBins,
} from '../metricCalculations';

describe('extractValues', () => {
  it('returns empty array for empty history', () => {
    expect(extractValues([], 'leadTime')).toEqual([]);
  });

  it('returns empty array for falsy dataKey', () => {
    expect(extractValues([{ leadTime: 5 }], '')).toEqual([]);
  });

  it('returns empty array for null/undefined history', () => {
    expect(extractValues(null as any, 'x')).toEqual([]);
    expect(extractValues(undefined as any, 'x')).toEqual([]);
  });

  it('extracts numeric values correctly', () => {
    const history = [
      { sprint: 'S1', leadTime: 10 },
      { sprint: 'S2', leadTime: 8 },
      { sprint: 'S3', leadTime: 6 },
    ];
    expect(extractValues(history, 'leadTime')).toEqual([10, 8, 6]);
  });

  it('maps missing dataKey to 0', () => {
    const history = [
      { sprint: 'S1', leadTime: 10 },
      { sprint: 'S2' },
    ];
    expect(extractValues(history, 'leadTime')).toEqual([10, 0]);
  });

  it('maps non-numeric values to 0', () => {
    const history = [
      { x: 'hello' },
      { x: NaN },
      { x: Infinity },
      { x: 5 },
    ];
    expect(extractValues(history, 'x')).toEqual([0, 0, 0, 5]);
  });
});

describe('computeStats', () => {
  it('returns zeroed stats for empty array', () => {
    const stats = computeStats([]);
    expect(stats.avg).toBe(0);
    expect(stats.min).toBe(0);
    expect(stats.max).toBe(0);
    expect(stats.stdDev).toBe(0);
    expect(stats.lastVal).toBe(0);
    expect(stats.prevVal).toBe(0);
    expect(stats.changePercent).toBe('0');
  });

  it('handles single-point history', () => {
    const stats = computeStats([42]);
    expect(stats.avg).toBe(42);
    expect(stats.min).toBe(42);
    expect(stats.max).toBe(42);
    expect(stats.stdDev).toBe(0);
    expect(stats.lastVal).toBe(42);
    expect(stats.prevVal).toBe(42); // falls back to lastVal
    expect(stats.changePercent).toBe('0.0'); // no change
  });

  it('computes correct stats for multiple values', () => {
    const stats = computeStats([10, 20, 30]);
    expect(stats.avg).toBe(20);
    expect(stats.min).toBe(10);
    expect(stats.max).toBe(30);
    expect(stats.lastVal).toBe(30);
    expect(stats.prevVal).toBe(20);
    // change: (30-20)/20 * 100 = 50.0
    expect(stats.changePercent).toBe('50.0');
  });

  it('handles prevVal of 0 without division by zero', () => {
    const stats = computeStats([0, 5]);
    expect(stats.changePercent).toBe('0'); // prevVal is 0, returns '0'
  });

  it('stdDev is 0 for identical values', () => {
    const stats = computeStats([7, 7, 7]);
    expect(stats.stdDev).toBe(0);
  });
});

describe('safePercentile', () => {
  it('returns 0 for empty array', () => {
    expect(safePercentile([], 0.5)).toBe(0);
  });

  it('returns 0 for null/undefined', () => {
    expect(safePercentile(null as any, 0.5)).toBe(0);
    expect(safePercentile(undefined as any, 0.5)).toBe(0);
  });

  it('returns the only value for single-item array', () => {
    expect(safePercentile([{ cycleTime: 3.5 }], 0.5)).toBe(3.5);
    expect(safePercentile([{ cycleTime: 3.5 }], 0.95)).toBe(3.5);
  });

  it('returns correct percentile for sorted array', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => ({ cycleTime: v }));
    expect(safePercentile(items, 0.5)).toBe(6); // index 5
    expect(safePercentile(items, 0.85)).toBe(9); // index 8
    expect(safePercentile(items, 0.95)).toBe(10); // index 9 (clamped)
  });

  it('handles item with missing cycleTime', () => {
    expect(safePercentile([{} as any], 0.5)).toBe(0);
  });
});

describe('buildHistogramBins', () => {
  it('returns empty array for empty values', () => {
    expect(buildHistogramBins([])).toEqual([]);
  });

  it('creates correct number of bins', () => {
    const bins = buildHistogramBins([1, 2, 3, 4, 5], 3);
    expect(bins).toHaveLength(3);
  });

  it('handles single value', () => {
    const bins = buildHistogramBins([5], 3);
    expect(bins).toHaveLength(3);
    // All items in one bin since binWidth is 1 (fallback)
    const totalCount = bins.reduce((s, b) => s + b.count, 0);
    expect(totalCount).toBe(1);
  });

  it('handles identical values', () => {
    const bins = buildHistogramBins([5, 5, 5], 4);
    expect(bins).toHaveLength(4);
    const totalCount = bins.reduce((s, b) => s + b.count, 0);
    expect(totalCount).toBe(3);
  });

  it('bins sum to total count', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const bins = buildHistogramBins(values, 5);
    const totalCount = bins.reduce((s, b) => s + b.count, 0);
    expect(totalCount).toBe(values.length);
  });
});
