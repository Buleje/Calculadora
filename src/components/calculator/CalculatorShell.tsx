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
  const [committed, setCommitted] = useState<Committed>({ value: '0', isError: false });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const displayed = useMemo<Committed>(() => {
    if (!expression || justEvaluated) return committed;
    try {
      const val = evaluate(expression, angleMode);
      const fmt = formatNumber(val);
      return { value: fmt, isError: fmt === 'Error' };
    } catch {
      return committed;
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
    <div className="flex flex-col lg:flex-row items-start gap-6 w-full max-w-3xl">
      {/* Calculator card */}
      <div className="flex flex-col w-full sm:w-96 mx-auto lg:mx-0 bg-calc-bg rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-border">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-btn-equals" />
            <span className="text-text-muted text-xs font-bold tracking-widest uppercase">
              CalcPro
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* DEG/RAD toggle */}
            <div className="flex items-center gap-0.5 bg-btn-function rounded-lg p-0.5">
              <button
                onClick={() => setAngleMode('deg')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  angleMode === 'deg'
                    ? 'bg-btn-operator text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                DEG
              </button>
              <button
                onClick={() => setAngleMode('rad')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  angleMode === 'rad'
                    ? 'bg-btn-operator text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                RAD
              </button>
            </div>

            {/* History toggle */}
            <button
              onClick={() => setShowHistory((h) => !h)}
              aria-label="Toggle history"
              className={`p-2 rounded-lg transition-all duration-200 ${
                showHistory
                  ? 'text-text-accent bg-btn-equals/10'
                  : 'text-text-muted hover:text-text-secondary hover:bg-btn-function'
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
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>
          </div>
        </div>

        <Display
          expression={expression}
          result={displayed.value}
          isError={displayed.isError}
          justEvaluated={justEvaluated}
        />

        <Keypad onKey={handleKey} />
      </div>

      {/* History panel */}
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
