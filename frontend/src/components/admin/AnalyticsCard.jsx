import React from 'react';
import DashboardCard from '../ui/DashboardCard';
import { Target, CheckCircle, FileText, Globe, EyeOff, Archive } from 'lucide-react';

export default function AnalyticsCard({ title, data, icon: Icon }) {
  if (!data) return null;

  return (
    <DashboardCard className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-purple-400">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
          <p className="text-2xl font-bold text-zinc-100">{data.total}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800/50">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1"><Globe size={10} /> Published</span>
          <span className="text-sm font-medium text-green-400">{data.published || 0}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1"><EyeOff size={10} /> Drafts</span>
          <span className="text-sm font-medium text-amber-400">{data.draft || 0}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1"><Archive size={10} /> Archived</span>
          <span className="text-sm font-medium text-zinc-400">{data.archived || 0}</span>
        </div>
      </div>
    </DashboardCard>
  );
}
