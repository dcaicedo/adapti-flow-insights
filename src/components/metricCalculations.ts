/**
 * Pure calculation helpers for MetricDetailDialog.
 * Extracted for testability and runtime safety.
 */

export interface MetricStats {
  values: number[];
  avg: number;
  min: number;
  max: number;
  stdDev: number;
  lastVal: number;
  prevVal: number;
  changePercent: string;
}

/**
 * Safely extract numeric values from history items using the given dataKey.
 * Filters out non-finite numbers and coerces undefined/null to 0.
 */
export function extractValues(history: Record<string, unknown>[], dataKey: string): number[] {
  if (!history?.length || !dataKey) return [];
  return history.map(h => {
    const raw = h[dataKey];
    if (raw === undefined || raw === null) return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  });
}

/**
 * Compute descriptive statistics from a numeric array.
 * Every field is guaranteed to be a finite number or '0' string.
 */
export function computeStats(values: number[]): MetricStats {
  if (!values.length) {
    return { values: [], avg: 0, min: 0, max: 0, stdDev: 0, lastVal: 0, prevVal: 0, changePercent: '0' };
  }

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const stdDev = Math.sqrt(values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length);
  const lastVal = values[values.length - 1] ?? 0;
  const prevVal = values.length >= 2 ? values[values.length - 2] : lastVal;
  const changePercent = prevVal !== 0
    ? (((lastVal - prevVal) / prevVal) * 100).toFixed(1)
    : '0';

  return { values, avg, min, max, stdDev, lastVal, prevVal, changePercent };
}

/**
 * Safely compute a percentile value from a sorted array.
 * Returns 0 for empty/short arrays.
 */
export function safePercentile(sortedItems: { cycleTime: number }[], percentile: number): number {
  if (!sortedItems?.length) return 0;
  const idx = Math.min(Math.floor(sortedItems.length * percentile), sortedItems.length - 1);
  return sortedItems[idx]?.cycleTime ?? 0;
}

/**
 * Build histogram bins from values. Returns empty array for empty input.
 */
export function buildHistogramBins(values: number[], binCount: number = 6) {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / binCount || 1;
  return Array.from({ length: binCount }, (_, i) => {
    const lo = min + i * binWidth;
    const hi = lo + binWidth;
    const count = values.filter(v => v >= lo && (i === binCount - 1 ? v <= hi : v < hi)).length;
    return { range: `${lo.toFixed(1)}–${hi.toFixed(1)}`, count, lo, hi };
  });
}
