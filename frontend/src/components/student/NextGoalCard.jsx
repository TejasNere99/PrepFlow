import React from 'react';
import DashboardCard from '../ui/DashboardCard';
import { Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function NextGoalCard({ nextGoal }) {
  const navigate = useNavigate();

  if (!nextGoal) return null;

  return (
    <DashboardCard 
      className={`relative overflow-hidden ${nextGoal.url ? 'cursor-pointer hover:border-zinc-700 transition-colors' : ''}`}
      onClick={() => { if (nextGoal.url) navigate(nextGoal.url); }}
    >
      <div className="relative z-10 flex items-start gap-4">
        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
          <Compass size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Next Goal</h3>
          <p className="text-sm font-medium text-zinc-200 mb-1">{nextGoal.title}</p>
          <p className="text-xs text-zinc-500">{nextGoal.message}</p>
        </div>
      </div>
    </DashboardCard>
  );
}

export default NextGoalCard;
