import React from 'react';
import { Filter, X } from 'lucide-react';
import Button from '../ui/Button';

export default function AdvancedFilterPanel({ filters, onFilterChange, onClear, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mt-4 mb-6 animate-in slide-in-from-top-2 duration-150 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Filter size={16} className="text-purple-400" /> Advanced Filters
        </h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 p-1">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Status</label>
          <select 
            value={filters.status || ''} 
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        
        {/* Resource Type Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Resource Type</label>
          <select 
            value={filters.resourceType || ''} 
            onChange={(e) => onFilterChange('resourceType', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="">All Types</option>
            <option value="Video">Video</option>
            <option value="Document">Document</option>
            <option value="Link">Link</option>
          </select>
        </div>

        {/* Tags Filter */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-zinc-400">Tags (comma separated)</label>
          <input 
            type="text"
            placeholder="e.g. math, physics, hard"
            value={filters.tags || ''} 
            onChange={(e) => onFilterChange('tags', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <Button onClick={onClear} variant="secondary" className="text-xs py-1.5">
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
