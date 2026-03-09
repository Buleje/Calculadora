import type { HistoryEntry } from '@/types/calculator';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export default function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  return (
    <div className="flex flex-col w-full lg:w-64 max-h-120 lg:max-h-150 bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 shrink-0">
        <h2 className="text-zinc-300 text-sm font-semibold tracking-wide">History</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-zinc-500 hover:text-rose-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 scrollbar-none">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-24">
            <p className="text-zinc-600 text-sm">No calculations yet</p>
          </div>
        ) : (
          <ul>
            {history.map((entry) => (
              <li
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="px-5 py-3 cursor-pointer hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 last:border-0"
              >
                <p className="text-zinc-500 text-xs font-mono truncate">{entry.expression}</p>
                <p className="text-zinc-100 text-lg font-mono font-medium mt-0.5">{entry.result}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
