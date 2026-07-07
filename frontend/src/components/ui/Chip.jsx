import { X } from 'lucide-react';
import { cn } from '../../utils/cn.js';

function Chip({ children, removable = false, onRemove, className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-300',
        className,
      )}
    >
      {children}
      {removable && (
        <button
          aria-label="Remove"
          className="rounded text-zinc-500 transition-colors hover:text-zinc-100"
          onClick={onRemove}
          type="button"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}

export default Chip;
