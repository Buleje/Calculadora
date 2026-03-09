import type { CalcKey } from '@/types/calculator';

// Scientific functions group
const SCIENTIFIC_KEYS: CalcKey[][] = [
  [
    { label: 'sin',   value: 'sin(',  type: 'function' },
    { label: 'cos',   value: 'cos(',  type: 'function' },
    { label: 'tan',   value: 'tan(',  type: 'function' },
    { label: 'log',   value: 'log(',  type: 'function' },
    { label: 'ln',    value: 'ln(',   type: 'function' },
  ],
  [
    { label: 'sin\u207b\u00b9', value: 'asin(', type: 'function' },
    { label: 'cos\u207b\u00b9', value: 'acos(', type: 'function' },
    { label: 'tan\u207b\u00b9', value: 'atan(', type: 'function' },
    { label: 'x\u00b2',  value: '^2',    type: 'function' },
    { label: 'x\u02b8', value: '^',   type: 'operator' },
  ],
  [
    { label: '\u221a',   value: 'sqrt(', type: 'function' },
    { label: '\u221b',   value: 'cbrt(', type: 'function' },
    { label: '\u03c0',   value: 'pi',    type: 'constant' },
    { label: 'e',   value: 'e',     type: 'constant' },
    { label: '%',   value: '%',     type: 'operator' },
  ],
];

// Main number pad with operators
const NUMBER_KEYS: CalcKey[][] = [
  [
    { label: '(',   value: '(',   type: 'operator' },
    { label: ')',   value: ')',   type: 'operator' },
    { label: 'AC',  value: 'AC',  type: 'action' },
    { label: '\u232b',  value: 'DEL', type: 'action' },
  ],
  [
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '\u00f7', value: '/', type: 'operator' },
  ],
  [
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '\u00d7', value: '*', type: 'operator' },
  ],
  [
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '\u2212', value: '-', type: 'operator' },
  ],
  [
    { label: '\u00b1',  value: 'NEG', type: 'action' },
    { label: '0',  value: '0',   type: 'number' },
    { label: '.',  value: '.',   type: 'number' },
    { label: '+', value: '+', type: 'operator' },
  ],
];

const EQUALS_KEY: CalcKey = { label: '=', value: '=', type: 'equals' };

function getKeyClass(key: CalcKey): string {
  const baseClass = 'calc-btn rounded-xl flex items-center justify-center select-none font-medium';
  
  if (key.value === 'AC') {
    return `${baseClass} bg-btn-action hover:bg-btn-action-hover active:bg-btn-action-active text-text-primary font-semibold text-sm`;
  }
  
  if (key.value === 'DEL') {
    return `${baseClass} bg-calc-surface hover:bg-calc-surface-hover active:bg-calc-surface-active text-text-error text-lg`;
  }
  
  const map: Record<string, string> = {
    number:   `${baseClass} bg-btn-number hover:bg-btn-number-hover active:bg-btn-number-active text-text-primary text-xl`,
    operator: `${baseClass} bg-btn-operator hover:bg-btn-operator-hover active:bg-btn-operator-active text-text-primary text-lg font-semibold`,
    function: `${baseClass} bg-btn-function hover:bg-btn-function-hover active:bg-btn-function-active text-text-function text-xs font-semibold tracking-tight`,
    constant: `${baseClass} bg-btn-function hover:bg-btn-function-hover active:bg-btn-function-active text-text-constant text-base font-semibold`,
    action:   `${baseClass} bg-calc-surface hover:bg-calc-surface-hover active:bg-calc-surface-active text-text-secondary text-lg`,
    equals:   `${baseClass} equals-glow bg-btn-equals hover:bg-btn-equals-hover active:bg-btn-equals-active text-calc-bg text-2xl font-bold`,
  };
  
  return map[key.type] ?? map['number'];
}

interface KeypadProps {
  onKey: (value: string) => void;
}

export default function Keypad({ onKey }: KeypadProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Scientific functions section */}
      <div className="space-y-2">
        <p className="text-text-muted text-[10px] uppercase tracking-widest font-semibold px-1">Functions</p>
        <div className="grid grid-cols-5 gap-2">
          {SCIENTIFIC_KEYS.flat().map((key, i) => (
            <button
              key={`sci-${i}`}
              onClick={() => onKey(key.value)}
              className={`${getKeyClass(key)} h-10`}
            >
              {key.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-subtle" />

      {/* Main number pad */}
      <div className="grid grid-cols-4 gap-2.5">
        {NUMBER_KEYS.flat().map((key, i) => (
          <button
            key={`num-${i}`}
            onClick={() => onKey(key.value)}
            className={`${getKeyClass(key)} h-14`}
          >
            {key.label}
          </button>
        ))}
        
        {/* Equals button spans full width */}
        <button
          onClick={() => onKey(EQUALS_KEY.value)}
          className={`${getKeyClass(EQUALS_KEY)} h-14 col-span-4`}
        >
          {EQUALS_KEY.label}
        </button>
      </div>
    </div>
  );
}
