export type TokenType =
  | 'NUMBER'
  | 'IDENT'
  | 'PLUS'
  | 'MINUS'
  | 'STAR'
  | 'SLASH'
  | 'CARET'
  | 'PERCENT'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'FACTORIAL'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = input.length;

  while (i < len) {
    const ch = input[i];

    if (/\s/.test(ch)) { i++; continue; }

    // Numbers — supports integers, decimals, and scientific notation (1e10, 2.5e-3)
    if (/\d/.test(ch) || (ch === '.' && /\d/.test(input[i + 1] ?? ''))) {
      let num = '';
      while (i < len && /[\d.]/.test(input[i])) num += input[i++];
      // Scientific-notation suffix: only when e/E is followed by digits or ±digits
      if (i < len && (input[i] === 'e' || input[i] === 'E')) {
        const c1 = input[i + 1] ?? '';
        const c2 = input[i + 2] ?? '';
        if (/\d/.test(c1) || ((c1 === '+' || c1 === '-') && /\d/.test(c2))) {
          num += input[i++];
          if (input[i] === '+' || input[i] === '-') num += input[i++];
          while (i < len && /\d/.test(input[i])) num += input[i++];
        }
      }
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    // Identifiers — function names and constants
    if (/[a-zA-Z_]/.test(ch)) {
      let ident = '';
      while (i < len && /[a-zA-Z_\d]/.test(input[i])) ident += input[i++];
      tokens.push({ type: 'IDENT', value: ident });
      continue;
    }

    const single: Record<string, TokenType> = {
      '+': 'PLUS', '-': 'MINUS', '*': 'STAR', '/': 'SLASH',
      '^': 'CARET', '%': 'PERCENT', '(': 'LPAREN', ')': 'RPAREN',
      ',': 'COMMA', '!': 'FACTORIAL',
    };

    if (ch in single) {
      tokens.push({ type: single[ch], value: ch });
      i++;
      continue;
    }

    throw new Error(`Unknown character: "${ch}"`);
  }

  tokens.push({ type: 'EOF', value: '' });
  return tokens;
}
