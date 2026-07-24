import React from 'react';
import Card from '../ui/Card.jsx';

function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <Card className="flex items-center gap-4">
      {Icon && (
        <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-zinc-100">{value}</p>
          {subtitle && <span className="text-sm font-medium text-zinc-500">{subtitle}</span>}
        </div>
      </div>
    </Card>
  );
}

export default StatCard;
