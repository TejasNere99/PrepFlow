import { cn } from '../../utils/cn.js';

const variants = {
  neutral: 'border-zinc-700 bg-zinc-900 text-zinc-300',
  success: 'border-emerald-700 bg-emerald-950 text-emerald-300',
  warning: 'border-amber-700 bg-amber-950 text-amber-300',
};

function Badge({ children, className = '', variant = 'neutral' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
