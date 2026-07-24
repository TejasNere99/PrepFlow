import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, Book, FileText, Bookmark, Layout } from 'lucide-react';
import { publicApi } from '../../services/publicApi.js';

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      setResults(null);
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await publicApi.search(query);
        setResults(res.data);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (url) => {
    setIsOpen(false);
    navigate(url);
  };

  if (!isOpen) return null;

  const hasResults = results && (
    results.sheets?.length > 0 ||
    results.subjects?.length > 0 ||
    results.chapters?.length > 0 ||
    results.resources?.length > 0
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 pb-4 px-4 bg-zinc-950/80 backdrop-blur-sm">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsOpen(false)} 
      />
      
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-zinc-800">
          <Search className="text-zinc-400 shrink-0" size={24} />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-0 focus:ring-0 text-zinc-100 text-lg px-4 placeholder:text-zinc-500"
            placeholder="Search sheets, subjects, chapters, resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 className="animate-spin text-zinc-400 shrink-0 mr-4" size={20} />}
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          {!query.trim() && (
            <div className="py-12 text-center text-zinc-500">
              <p>Type to start searching across PrepFlow.</p>
            </div>
          )}

          {query.trim() && !loading && !hasResults && (
            <div className="py-12 text-center text-zinc-500">
              <p>No results found for "{query}"</p>
            </div>
          )}

          {hasResults && (
            <div className="space-y-6 p-2">
              {results.sheets?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 px-2">Sheets</h3>
                  <div className="space-y-1">
                    {results.sheets.map(sheet => (
                      <button 
                        key={sheet._id}
                        onClick={() => handleSelect(`/sheets/${sheet.slug}`)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400 text-zinc-300 text-left transition-colors"
                      >
                        <Layout size={18} className="text-zinc-500 shrink-0" />
                        <span className="truncate">{sheet.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.resources?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 px-2">Resources</h3>
                  <div className="space-y-1">
                    {results.resources.map(resource => (
                      <button 
                        key={resource._id}
                        onClick={() => handleSelect(`/resources/${resource.slug}`)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400 text-zinc-300 text-left transition-colors group"
                      >
                        <Book size={18} className="text-zinc-500 group-hover:text-indigo-400 shrink-0" />
                        <div className="min-w-0 flex-1 flex items-center justify-between gap-4">
                          <span className="truncate">{resource.title}</span>
                          {resource.type && (
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                              {resource.type}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Subjects / Chapters can also be rendered if needed, though they don't have direct routes yet without sheets. For now, focusing on Sheets and Resources provides immediate value. */}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-zinc-900 border-t border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded font-sans text-[10px]">↑</kbd><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded font-sans text-[10px]">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded font-sans text-[10px]">Enter</kbd> to select</span>
          </div>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded font-sans text-[10px]">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
