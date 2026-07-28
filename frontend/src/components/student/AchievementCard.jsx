import React from 'react';
import DashboardCard from '../ui/DashboardCard';
import * as Icons from 'lucide-react';

function AchievementCard({ achievement }) {
  const { title, description, icon } = achievement;
  const IconComponent = Icons[icon] || Icons.Award;

  return (
    <DashboardCard className="flex flex-col items-center justify-center text-center">
      <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 mb-3">
        <IconComponent size={20} className="text-zinc-400" strokeWidth={1.5} />
      </div>
      <h4 className="text-sm font-medium text-zinc-200 mb-1">{title}</h4>
      <p className="text-xs text-zinc-500 max-w-[120px]">{description}</p>
    </DashboardCard>
  );
}

export default AchievementCard;
