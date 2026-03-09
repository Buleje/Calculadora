import { formatExpression } from '@/lib/calculator/format';

interface DisplayProps {
  expression: string;
  result: string;
  isError: boolean;
  justEvaluated: boolean;
}

export default function Display({ expression, result, isError, justEvaluated }: DisplayProps) {
  const resultColor = isError
    ? 'text-red-400'
    : justEvaluated
    ? 'text-white'
    : result === '0'
    ? 'text-zinc-600'
    : 'text-zinc-200';

  return (
    <div className="px-6 py-4 flex flex-col justify-end gap-1.5 min-h-31.5 select-none border-b border-zinc-800/60">
      {/* Expression line */}
      <div className="overflow-x-auto scrollbar-none">
        <p className="text-zinc-500 text-sm font-mono text-right whitespace-nowrap min-h-4.5 leading-relaxed">
          {expression ? formatExpression(expression) : ''}
        </p>
      </div>

      {/* Result line */}
      <div className="overflow-x-auto scrollbar-none">
        <p
          className={`font-mono font-light text-right whitespace-nowrap text-4xl tracking-tight transition-colors duration-100 ${resultColor}`}
        >
          {result}
        </p>
      </div>
    </div>
  );
}
