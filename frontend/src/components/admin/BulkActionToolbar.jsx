import React from 'react';
import { Trash2, Archive, Globe, EyeOff, FolderInput, Tag } from 'lucide-react';
import Button from '../ui/Button';

export default function BulkActionToolbar({ selectedCount, onAction }) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-zinc-900 border border-zinc-700 shadow-2xl rounded-full px-6 py-3 flex items-center gap-4">
        <span className="text-sm font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full shrink-0">
          {selectedCount} selected
        </span>
        
        <div className="h-4 w-px bg-zinc-700"></div>

        <div className="flex items-center gap-2">
          <button onClick={() => onAction('BULK_PUBLISH')} className="p-2 text-zinc-400 hover:text-green-400 hover:bg-zinc-800 rounded-full transition-colors group relative" title="Publish">
            <Globe size={18} />
          </button>
          <button onClick={() => onAction('BULK_UNPUBLISH')} className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-full transition-colors group relative" title="Unpublish">
            <EyeOff size={18} />
          </button>
          <button onClick={() => onAction('BULK_MOVE')} className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-full transition-colors group relative" title="Move">
            <FolderInput size={18} />
          </button>
          <button onClick={() => onAction('BULK_UPDATE_TAGS')} className="p-2 text-zinc-400 hover:text-purple-400 hover:bg-zinc-800 rounded-full transition-colors group relative" title="Update Tags">
            <Tag size={18} />
          </button>
          <div className="h-4 w-px bg-zinc-700 mx-1"></div>
          <button onClick={() => onAction('BULK_ARCHIVE')} className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 rounded-full transition-colors group relative" title="Archive">
            <Archive size={18} />
          </button>
          <button onClick={() => onAction('BULK_DELETE')} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-full transition-colors group relative" title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
