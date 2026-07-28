import React from 'react';
import { Search, Filter, Plus, Upload } from 'lucide-react';
import Button from '../ui/Button';

export default function ReusableTableToolbar({ 
  searchQuery, 
  onSearchChange, 
  onToggleFilters, 
  onAdd, 
  onImport,
  addLabel = "Add New",
  importLabel = "Import CSV",
  isFiltersOpen
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="relative flex-1 max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-zinc-500" />
        </div>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button 
          onClick={onToggleFilters} 
          variant="secondary" 
          className={`flex-1 sm:flex-none gap-2 ${isFiltersOpen ? 'bg-zinc-800 text-purple-400' : ''}`}
        >
          <Filter size={16} /> Filters
        </Button>
        
        {onImport && (
          <Button onClick={onImport} variant="secondary" className="flex-1 sm:flex-none gap-2">
            <Upload size={16} /> {importLabel}
          </Button>
        )}

        <Button onClick={onAdd} className="flex-1 sm:flex-none gap-2 bg-purple-600 hover:bg-purple-500 text-white">
          <Plus size={16} /> {addLabel}
        </Button>
      </div>
    </div>
  );
}
