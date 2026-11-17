export function columnCount(columns: number): number {
  return Number.isFinite(columns) ? Math.max(1, Math.min(12, Math.floor(columns))) : 2;
}

export function progressRange(value: number, max: number) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current = Number.isFinite(value) ? Math.max(0, Math.min(limit, value)) : 0;
  return { value: current, max: limit };
}
