import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Input from './Input.jsx';

/**
 * Reusable CreatableSelect component
 * Supports predefined suggestions, free text creation, and keyboard navigation.
 */
export default function CreatableSelect({ 
  value, 
  onChange, 
  placeholder, 
  suggestions = [],
  required = false,
  className
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes((value || '').toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredSuggestions.length) {
        onChange(filteredSuggestions[activeIndex]);
      }
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative w-full ${className || ''}`} ref={containerRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pr-8"
          required={required}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500 hover:text-zinc-300"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && inputRef.current) inputRef.current.focus();
          }}
        >
          <ChevronDown size={16} />
        </button>
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-zinc-800 bg-zinc-950 p-1 shadow-lg">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, idx) => (
              <div
                key={suggestion}
                className={`cursor-pointer rounded px-3 py-2 text-sm transition-colors ${
                  idx === activeIndex 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
                onClick={() => {
                  onChange(suggestion);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {suggestion}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-zinc-500">
              Press enter to use "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
