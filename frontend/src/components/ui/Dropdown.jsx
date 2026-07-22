import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn.js';

function Dropdown({ label, items = [], className = '' }) {
  return (
    <details className={cn('group relative inline-block text-left', className)}>
      <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 transition-colors hover:bg-zinc-900">
        {label}
        <ChevronDown className="transition-transform group-open:rotate-180" size={16} />
      </summary>
      <div className="absolute right-0 z-20 mt-2 min-w-40 rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-xl">
        {items.map((item) => (
          <button
            className="block w-full rounded-md px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50"
            key={item.value}
            type="button"
            onClick={item.onClick}
          >
            {item.label}
          </button>
        ))}
      </div>
    </details>
  );
}

export default Dropdown;
