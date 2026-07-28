import React from 'react';
import { ChevronRight } from 'lucide-react';

const ListItem = ({ title, subtitle, icon: Icon, onClick, action, className = '' }) => {
  return (
    <div 
      onClick={onClick}
      className={`group flex items-center justify-between p-3 border-b border-zinc-800/40 last:border-0 hover:bg-zinc-900/40 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {Icon && <Icon className="text-zinc-500 shrink-0" size={16} strokeWidth={1.5} />}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-zinc-200 truncate group-hover:text-zinc-100 transition-colors">{title}</div>
          {subtitle && <div className="text-xs text-zinc-500 truncate mt-0.5">{subtitle}</div>}
        </div>
      </div>
      <div className="shrink-0 flex items-center ml-3">
        {action || (onClick && <ChevronRight className="text-zinc-600 group-hover:text-zinc-400 transition-colors" size={16} />)}
      </div>
    </div>
  );
};

export default ListItem;
