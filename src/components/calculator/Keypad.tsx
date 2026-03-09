import type { CalcKey } from '@/types/calculator';

const KEYS: CalcKey[][] = [
  [
    { label: 'sin',   value: 'sin(',  type: 'function' },
    { label: 'cos',   value: 'cos(',  type: 'function' },
    { label: 'tan',   value: 'tan(',  type: 'function' },
    { label: 'log',   value: 'log(',  type: 'function' },
    { label: 'ln',    value: 'ln(',   type: 'function' },
  ],
  [
    { label: 'sin⁻¹', value: 'asin(', type: 'function' },
    { label: 'cos⁻¹', value: 'acos(', type: 'function' },
    { label: 'tan⁻¹', value: 'atan(', type: 'function' },
    { label: '(',      value: '(',     type: 'operator' },
    { label: ')',      value: ')',     type: 'operator' },
  ],
  [
    { label: 'x²',  value: '^2',    type: 'function' },
    { label: '√',   value: 'sqrt(', type: 'function' },
    { label: '∛',   value: 'cbrt(', type: 'function' },
    { label: 'π',   value: 'pi',    type: 'constant' },
    { label: 'e',   value: 'e',     type: 'constant' },
  ],
  [
    { label: '7',  value: '7',   type: 'number' },
    { label: '8',  value: '8',   type: 'number' },
    { label: '9',  value: '9',   type: 'number' },
    { label: '⌫',  value: 'DEL', type: 'action' },
    { label: 'AC', value: 'AC',  type: 'action' },
  ],
  [
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '×', value: '*', type: 'operator' },
    { label: '÷', value: '/', type: 'operator' },
  ],
  [
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '+', value: '+', type: 'operator' },
    { label: '−', value: '-', type: 'operator' },
  ],
  [
    { label: '±',  value: 'NEG', type: 'action' },
    { label: '0',  value: '0',   type: 'number' },
    { label: '.',  value: '.',   type: 'number' },
    { label: 'xʸ', value: '^',   type: 'operator' },
    { label: '=',  value: '=',   type: 'equals' },
  ],
];

function getKeyClass(key: CalcKey): string {
  if (key.value === 'AC') {
    return 'bg-rose-600/80 hover:bg-rose-600 active:bg-rose-700 text-white font-semibold text-sm';
  }
  const map: Record<string, string> = {
    number:   'bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 text-white text-xl font-medium',
    operator: 'bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-400 text-white text-lg font-medium',
    function: 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-indigo-300 text-xs font-semibold',
    constant: 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-amber-300 text-base font-semibold',
    action:   'bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-400 text-zinc-100 text-lg',
    equals:   'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xl font-bold',
  };
  return map[key.type] ?? map['number'];
}

interface KeypadProps {
  onKey: (value: string) => void;
}

export default function Keypad({ onKey }: KeypadProps) {
  return (
    <div className="grid grid-cols-5 gap-2 p-3 pb-4">
      {KEYS.flat().map((key, i) => (
        <button
          key={i}
          onClick={() => onKey(key.value)}
          className={`${getKeyClass(key)} h-12 rounded-xl transition-all duration-75 active:scale-95 select-none flex items-center justify-center`}
        >
          {key.label}
        </button>
      ))}
    </div>
  );
}
