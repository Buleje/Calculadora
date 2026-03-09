'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import HistoryPanel from './HistoryPanel';
import { evaluate } from '@/lib/calculator/evaluator';
import { formatNumber, formatExpression } from '@/lib/calculator/format';
import type { AngleMode, HistoryEntry } from '@/types/calculator';

interface Committed {
  value: string;
  isError: boolean;
}

export default function CalculatorShell() {
  const [expression, setExpression] = useState('');
  // `committed` holds the result of the last = press (or the cleared '0' state)
  const [committed, setCommitted] = useState<Committed>({ value: '0', isError: false });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Live result computed during render — no useEffect needed, no cascading setState
  const displayed = useMemo<Committed>(() => {
    if (!expression || justEvaluated) return committed;
    try {
      const val = evaluate(expression, angleMode);
      const fmt = formatNumber(val);
      return { value: fmt, isError: fmt === 'Error' };
    } catch {
      return committed; // keep the last valid result while typing an incomplete expression
    }
  }, [expression, angleMode, justEvaluated, committed]);

  const handleKey = useCallback(
    (value: string) => {
      const cleared: Committed = { value: '0', isError: false };

      switch (value) {
        case 'AC':
          setExpression('');
          setCommitted(cleared);
          setJustEvaluated(false);
          break;

        case 'DEL':
          if (justEvaluated) {
            setExpression('');
            setCommitted(cleared);
            setJustEvaluated(false);
          } else {
            setExpression((prev) => prev.slice(0, -1));
          }
          break;

        case 'NEG':
          setExpression((prev) => {
            if (!prev) return '-';
            return prev.startsWith('-') ? prev.slice(1) : '-' + prev;
          });
          setJustEvaluated(false);
          break;

        case '=': {
          if (!expression) break;
          try {
            const val = evaluate(expression, angleMode);
            const fmt = formatNumber(val);
            const isErr = fmt === 'Error';
            const entry: HistoryEntry = {
              id: crypto.randomUUID(),
              expression: formatExpression(expression),
              result: fmt,
              timestamp: new Date(),
            };
            setHistory((prev) => [entry, ...prev].slice(0, 50));
            setCommitted({ value: fmt, isError: isErr });
            setExpression(isErr ? '' : fmt);
            setJustEvaluated(true);
          } catch {
            setCommitted({ value: 'Error', isError: true });
            setExpression('');
            setJustEvaluated(true);
          }
          break;
        }

        default: {
          const isOperator = /^[+\-*/^%]$/.test(value);
          if (justEvaluated) {
            // After =: operators continue from the result; anything else starts fresh
            setExpression(isOperator ? (prev) => prev + value : value);
            setJustEvaluated(false);
          } else {
            setExpression((prev) => prev + value);
          }
        }
      }
    },
    [expression, angleMode, justEvaluated],
  );

  // Physical keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[0-9]$/.test(e.key))               return handleKey(e.key);
      if (e.key === '.')                         return handleKey('.');
      if (e.key === '+')                         return handleKey('+');
      if (e.key === '-')                         return handleKey('-');
      if (e.key === '*')                         return handleKey('*');
      if (e.key === '/') { e.preventDefault();   return handleKey('/'); }
      if (e.key === '^')                         return handleKey('^');
      if (e.key === '%')                         return handleKey('%');
      if (e.key === '(')                         return handleKey('(');
      if (e.key === ')')                         return handleKey(')');
      if (e.key === 'Enter' || e.key === '=')    return handleKey('=');
      if (e.key === 'Backspace')                 return handleKey('DEL');
      if (e.key === 'Escape')                    return handleKey('AC');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  const handleHistorySelect = (entry: HistoryEntry) => {
    setExpression(entry.result);
    setCommitted({ value: entry.result, isError: false });
    setJustEvaluated(false);
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 w-full max-w-2xl">
      {/* ── Calculator card ── */}
      <div className="flex flex-col w-full sm:w-88 mx-auto lg:mx-0 bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/5">
        {/* Top bar: brand + DEG/RAD toggle + history toggle */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">
            CalcPro
          </span>

          <div className="flex items-center gap-0.5 bg-zinc-800 rounded-full p-0.5">
            <button
              onClick={() => setAngleMode('deg')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                angleMode === 'deg'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              DEG
            </button>
            <button
              onClick={() => setAngleMode('rad')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                angleMode === 'rad'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              RAD
            </button>
          </div>

          <button
            onClick={() => setShowHistory((h) => !h)}
            aria-label="Toggle history"
            className={`p-1.5 rounded-lg transition-colors ${
              showHistory
                ? 'text-indigo-400 bg-indigo-500/10'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4l3 3" />
            </svg>
          </button>
        </div>

        <Display
          expression={expression}
          result={displayed.value}
          isError={displayed.isError}
          justEvaluated={justEvaluated}
        />

        <Keypad onKey={handleKey} />
      </div>

      {/* ── History panel ── */}
      {showHistory && (
        <HistoryPanel
          history={history}
          onSelect={handleHistorySelect}
          onClear={() => setHistory([])}
        />
      )}
    </div>
  );
}
