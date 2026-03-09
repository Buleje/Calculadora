import type { HistoryEntry } from '@/types/calculator';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export default function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  return (
    <div className="flex flex-col w-full lg:w-72 max-h-[32rem] lg:max-h-[40rem] bg-calc-bg rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-4 h-4 text-text-muted" 
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
          <h2 className="text-text-secondary text-sm font-semibold tracking-wide">History</h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-text-muted hover:text-text-error transition-colors font-medium px-2 py-1 rounded-md hover:bg-btn-function"
          >
            Clear all
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 scrollbar-none">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-8 h-8 text-text-muted/50" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 3v5h5" />
              <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
              <path d="M12 7v5l4 2" />
            </svg>
            <p className="text-text-muted text-sm">No calculations yet</p>
          </div>
        ) : (
          <ul className="py-2">
            {history.map((entry, index) => (
              <li
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="group px-5 py-3.5 cursor-pointer hover:bg-btn-function transition-all duration-150 border-l-2 border-transparent hover:border-text-accent"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-text-muted text-xs font-mono truncate mb-1.5 group-hover:text-text-secondary transition-colors">
                      {entry.expression}
                    </p>
                    <p className="text-text-primary text-xl font-mono font-medium truncate group-hover:text-text-accent transition-colors">
                      {entry.result}
                    </p>
                  </div>
                  <span className="text-text-muted/50 text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    #{history.length - index}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Footer hint */}
      {history.length > 0 && (
        <div className="px-5 py-3 border-t border-border-subtle bg-btn-function/50">
          <p className="text-text-muted text-[10px] text-center">Click an entry to use its result</p>
        </div>
      )}
    </div>
  );
}
