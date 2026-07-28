import React, { useState, useEffect, useRef } from 'react';
import { studentService } from '../../../services/studentService';

const NotesEditor = ({ resourceId }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const data = await studentService.getNote(resourceId);
        setContent(data.content || '');
        if (data.updatedAt) {
          setLastSaved(new Date(data.updatedAt));
        }
      } catch (error) {
        console.error('Failed to fetch note', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [resourceId]);

  const saveNote = async (newContent) => {
    try {
      setSaving(true);
      const data = await studentService.saveNote(resourceId, newContent);
      setLastSaved(new Date(data.updatedAt));
    } catch (error) {
      console.error('Failed to save note', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setContent(val);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      saveNote(val);
    }, 1000);
  };

  if (loading) {
    return <div className="text-sm text-gray-500 animate-pulse p-4">Loading notes...</div>;
  }

  return (
    <div className="flex flex-col gap-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-150 p-4 bg-zinc-950/50 border border-zinc-800/60 rounded-xl">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-200">Personal Notes</h4>
        <div className="text-xs text-zinc-500 flex items-center gap-2">
          {saving && <span className="animate-pulse text-zinc-400">Saving...</span>}
          {!saving && lastSaved && <span>Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
        </div>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Type your personal notes here... (Auto-saves)"
        className="w-full min-h-[120px] p-3 bg-zinc-900 border border-zinc-800/60 rounded-lg focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 resize-y transition-colors text-sm text-zinc-200 placeholder:text-zinc-600"
      />
    </div>
  );
};

export default NotesEditor;
