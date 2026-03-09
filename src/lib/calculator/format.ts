/**
 * Formats a numeric result for display.
 * - Rounds to 10 significant digits to eliminate floating-point noise (0.1+0.2 → 0.3)
 * - Switches to scientific notation for very large (≥1e10) or very small (<0.0001) values
 */
export function formatNumber(value: number): string {
  if (Number.isNaN(value)) return 'Error';
  if (!isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';
  if (value === 0) return '0';

  const abs = Math.abs(value);

  if (abs >= 1e10 || (abs > 0 && abs < 0.0001)) {
    // Remove trailing zeros before the exponent marker
    return value.toExponential(6).replace(/\.?0+(e)/, '$1');
  }

  // toPrecision(10) then parseFloat removes trailing zeros cleanly
  return String(+value.toPrecision(10));
}

/**
 * Converts internal expression string to a human-readable form for the display.
 */
export function formatExpression(expr: string): string {
  return expr
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/\bpi\b/gi, 'π')
    .replace(/sqrt\(/g, '√(')
    .replace(/cbrt\(/g, '∛(');
}
