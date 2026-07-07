import { cn } from '../../utils/cn.js';

function Card({ children, className = '' }) {
  return (
    <div className={cn('rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-sm', className)}>
      {children}
    </div>
  );
}

export default Card;
