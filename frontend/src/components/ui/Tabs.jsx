import { cn } from '../../utils/cn.js';

function Tabs({ tabs = [], activeValue, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-1">
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;

        return (
          <button
            className={cn(
              'rounded-md px-3 py-1.5 text-sm transition-colors',
              isActive ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-100',
            )}
            key={tab.value}
            onClick={() => onChange?.(tab.value)}
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
