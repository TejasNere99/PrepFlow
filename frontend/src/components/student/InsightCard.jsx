import React from 'react';
import DashboardCard from '../ui/DashboardCard';
import { Target, TrendingUp, Zap, Sparkles } from 'lucide-react';

function InsightCard({ insight }) {
  const { type, title, message } = insight;

  const getIcon = () => {
    switch (type) {
      case 'ACTIVITY': return <TrendingUp size={20} className="text-blue-400" />;
      case 'STRENGTH': return <Zap size={20} className="text-yellow-400" />;
      case 'MOTIVATION': return <Sparkles size={20} className="text-purple-400" />;
      default: return <Target size={20} className="text-zinc-400" />;
    }
  };

  return (
    <DashboardCard className="flex items-start gap-4 hover:border-zinc-700 transition-colors cursor-default">
      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
        {getIcon()}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-zinc-200">{title}</h4>
        <p className="text-sm text-zinc-400 mt-1 leading-snug">{message}</p>
      </div>
    </DashboardCard>
  );
}

export default InsightCard;
