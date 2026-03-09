import { tokenize, Token, TokenType } from './parser';
import type { AngleMode } from '@/types/calculator';

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new Error('Factorial requires a non-negative integer');
  if (n > 170) throw new Error('Factorial overflow');
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

type MathFn = (args: number[], mode: AngleMode) => number;

const FUNCTIONS: Record<string, MathFn> = {
  sin:   ([x], m) => Math.sin(m === 'deg' ? toRadians(x) : x),
  cos:   ([x], m) => Math.cos(m === 'deg' ? toRadians(x) : x),
  tan:   ([x], m) => Math.tan(m === 'deg' ? toRadians(x) : x),
  asin:  ([x], m) => { const r = Math.asin(x); return m === 'deg' ? toDegrees(r) : r; },
  acos:  ([x], m) => { const r = Math.acos(x); return m === 'deg' ? toDegrees(r) : r; },
  atan:  ([x], m) => { const r = Math.atan(x); return m === 'deg' ? toDegrees(r) : r; },
  sinh:  ([x]) => Math.sinh(x),
  cosh:  ([x]) => Math.cosh(x),
  tanh:  ([x]) => Math.tanh(x),
  sqrt:  ([x]) => Math.sqrt(x),
  cbrt:  ([x]) => Math.cbrt(x),
  abs:   ([x]) => Math.abs(x),
  log:   ([x]) => Math.log10(x),
  log2:  ([x]) => Math.log2(x),
  ln:    ([x]) => Math.log(x),
  exp:   ([x]) => Math.exp(x),
  floor: ([x]) => Math.floor(x),
  ceil:  ([x]) => Math.ceil(x),
  round: ([x]) => Math.round(x),
  pow:   ([x, y]) => Math.pow(x, y),
};

const CONSTANTS: Record<string, number> = {
  pi:  Math.PI,
  e:   Math.E,
  phi: (1 + Math.sqrt(5)) / 2,
};

/**
 * Inserts implicit multiplication tokens so that expressions like
 * "2pi", "2(3+4)", "(1+2)(3)", "2sin(45)" evaluate correctly.
 */
function insertImplicit(tokens: Token[]): Token[] {
  const STAR: Token = { type: 'STAR', value: '*' };
  const out: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    out.push(tokens[i]);
    if (i + 1 >= tokens.length) break;

    const curr = tokens[i];
    const next = tokens[i + 1];

    const currIsValue =
      curr.type === 'NUMBER' ||
      curr.type === 'RPAREN' ||
      (curr.type === 'IDENT' && curr.value.toLowerCase() in CONSTANTS);

    const nextStartsValue =
      next.type === 'NUMBER' ||
      next.type === 'LPAREN' ||
      next.type === 'IDENT';

    if (currIsValue && nextStartsValue) {
      out.push(STAR);
    }
  }

  return out;
}

class ExprParser {
  private pos = 0;

  constructor(
    private readonly tokens: Token[],
    private readonly mode: AngleMode,
  ) {}

  private peek(): Token {
    return this.tokens[this.pos] ?? { type: 'EOF', value: '' };
  }

  private consume(): Token {
    return this.tokens[this.pos++] ?? { type: 'EOF', value: '' };
  }

  private expect(type: TokenType): Token {
    const tok = this.consume();
    if (tok.type !== type) throw new Error(`Expected ${type} but got "${tok.value}"`);
    return tok;
  }

  parse(): number {
    const val = this.parseAddSub();
    if (this.peek().type !== 'EOF') {
      throw new Error(`Unexpected token: "${this.peek().value}"`);
    }
    return val;
  }

  private parseAddSub(): number {
    let left = this.parseMulDiv();
    while (this.peek().type === 'PLUS' || this.peek().type === 'MINUS') {
      const op = this.consume();
      const right = this.parseMulDiv();
      left = op.type === 'PLUS' ? left + right : left - right;
    }
    return left;
  }

  private parseMulDiv(): number {
    let left = this.parsePower();
    while (
      this.peek().type === 'STAR' ||
      this.peek().type === 'SLASH' ||
      this.peek().type === 'PERCENT'
    ) {
      const op = this.consume();
      const right = this.parsePower();
      if (op.type === 'STAR')    left *= right;
      else if (op.type === 'SLASH') left /= right;
      else                          left %= right;
    }
    return left;
  }

  private parsePower(): number {
    const base = this.parseUnary();
    if (this.peek().type === 'CARET') {
      this.consume();
      return Math.pow(base, this.parsePower()); // right-associative
    }
    return base;
  }

  private parseUnary(): number {
    if (this.peek().type === 'MINUS') { this.consume(); return -this.parseUnary(); }
    if (this.peek().type === 'PLUS')  { this.consume(); return  this.parseUnary(); }
    return this.parsePostfix();
  }

  private parsePostfix(): number {
    let val = this.parsePrimary();
    while (this.peek().type === 'FACTORIAL') {
      this.consume();
      val = factorial(val);
    }
    return val;
  }

  private parsePrimary(): number {
    const tok = this.peek();

    if (tok.type === 'NUMBER') {
      this.consume();
      return parseFloat(tok.value);
    }

    if (tok.type === 'IDENT') {
      this.consume();
      const name = tok.value.toLowerCase();

      // Function call: name(arg1, arg2, ...)
      if (this.peek().type === 'LPAREN') {
        this.consume(); // '('
        const args: number[] = [];
        if (this.peek().type !== 'RPAREN') {
          args.push(this.parseAddSub());
          while (this.peek().type === 'COMMA') {
            this.consume();
            args.push(this.parseAddSub());
          }
        }
        this.expect('RPAREN');
        const fn = FUNCTIONS[name];
        if (!fn) throw new Error(`Unknown function: "${tok.value}"`);
        return fn(args, this.mode);
      }

      // Named constant
      if (name in CONSTANTS) return CONSTANTS[name];

      throw new Error(`Unknown identifier: "${tok.value}"`);
    }

    if (tok.type === 'LPAREN') {
      this.consume();
      const val = this.parseAddSub();
      this.expect('RPAREN');
      return val;
    }

    if (tok.type === 'EOF') throw new Error('Unexpected end of expression');
    throw new Error(`Unexpected token: "${tok.value}"`);
  }
}

export function evaluate(expression: string, angleMode: AngleMode): number {
  const trimmed = expression.trim();
  if (!trimmed) throw new Error('Empty expression');
  const raw = tokenize(trimmed);
  const tokens = insertImplicit(raw);
  return new ExprParser(tokens, angleMode).parse();
}
