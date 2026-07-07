import { cn } from '../../utils/cn.js';

function Input({ className = '', ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800',
        className,
      )}
      {...props}
    />
  );
}

export default Input;
