import React, { useState } from 'react';
import { studentService } from '../../../services/studentService';
import { X, Calendar, CalendarClock } from 'lucide-react';

const RevisionPlannerModal = ({ resourceId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [customDate, setCustomDate] = useState('');

  const handleSchedule = async (dateStr) => {
    try {
      setLoading(true);
      await studentService.scheduleRevision(resourceId, dateStr);
      onClose();
    } catch (error) {
      console.error('Failed to schedule revision', error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    handleSchedule(d.toISOString());
  };

  const scheduleNextWeek = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    handleSchedule(d.toISOString());
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customDate) return;
    handleSchedule(new Date(customDate).toISOString());
  };

  return (
    <div className="mt-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/60 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium text-zinc-200">Schedule Revision</h4>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button 
          onClick={scheduleTomorrow}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800/60 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 text-sm py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
        >
          <Calendar size={14} className="text-zinc-500" />
          Tomorrow
        </button>
        <button 
          onClick={scheduleNextWeek}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800/60 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 text-sm py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
        >
          <CalendarClock size={14} className="text-zinc-500" />
          Next Week
        </button>
      </div>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800/60"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-zinc-950 px-2 text-zinc-500 uppercase tracking-wider">Or custom date</span>
        </div>
      </div>

      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <input 
          type="date"
          min={new Date().toISOString().split('T')[0]}
          value={customDate}
          onChange={(e) => setCustomDate(e.target.value)}
          className="flex-1 bg-zinc-900 border border-zinc-800/60 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
        />
        <button
          type="submit"
          disabled={loading || !customDate}
          className="bg-zinc-100 hover:bg-white text-zinc-900 px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
        >
          Schedule
        </button>
      </form>
    </div>
  );
};

export default RevisionPlannerModal;
