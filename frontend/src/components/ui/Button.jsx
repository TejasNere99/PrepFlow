import { cn } from '../../utils/cn.js';

const variants = {
  primary: 'bg-zinc-100 text-zinc-950 hover:bg-white',
  secondary: 'border border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800',
  ghost: 'text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50',
  danger: 'bg-red-500 text-white hover:bg-red-400',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  icon: 'h-9 w-9 p-0',
};

function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
