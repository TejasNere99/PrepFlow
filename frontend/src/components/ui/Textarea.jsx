import { cn } from '../../utils/cn.js';

function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full resize-y rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800',
        className,
      )}
      {...props}
    />
  );
}

export default Textarea;
