import { formatExpression } from '@/lib/calculator/format';

interface DisplayProps {
  expression: string;
  result: string;
  isError: boolean;
  justEvaluated: boolean;
}

export default function Display({ expression, result, isError, justEvaluated }: DisplayProps) {
  const resultColor = isError
    ? 'text-text-error'
    : justEvaluated
      ? 'text-text-primary'
      : result === '0'
        ? 'text-text-muted'
        : 'text-text-secondary';

  return (
    <div className="glass-display px-6 py-6 flex flex-col justify-end gap-3 min-h-36 select-none border-b border-border-subtle">
      {/* Expression line */}
      <div className="overflow-x-auto scrollbar-none">
        <p className="text-text-muted text-base font-mono text-right whitespace-nowrap min-h-6 leading-relaxed tracking-wide">
          {expression ? formatExpression(expression) : '\u00A0'}
        </p>
      </div>

      {/* Result line */}
      <div className="overflow-x-auto scrollbar-none">
        <p
          className={`font-mono font-extralight text-right whitespace-nowrap text-5xl sm:text-6xl tracking-tight transition-all duration-200 ${resultColor}`}
        >
          {result}
        </p>
      </div>
    </div>
  );
}
