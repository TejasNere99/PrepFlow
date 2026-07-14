import React from 'react';
import { Search, X } from 'lucide-react';
import Input from './Input.jsx';

/**
 * Reusable SearchToolbar component
 */
export default function SearchToolbar({ 
  search, 
  onSearchChange, 
  placeholder = "Search...", 
  children // Additional filters (like Selects) can be passed as children
}) {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          className="pl-9"
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            type="button"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      {children && (
        <div className="flex items-center gap-2 flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
}
