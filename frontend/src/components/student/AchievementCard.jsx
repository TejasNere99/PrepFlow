import React from 'react';
import Card from '../ui/Card.jsx';
import * as Icons from 'lucide-react';

function AchievementCard({ achievement }) {
  const { title, description, icon } = achievement;
  const IconComponent = Icons[icon] || Icons.Award;

  return (
    <Card className="flex flex-col items-center justify-center text-center p-6 border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-zinc-900/50 hover:from-indigo-500/20 transition-colors">
      <div className="p-4 rounded-full bg-indigo-500/20 mb-4 ring-4 ring-indigo-500/10">
        <IconComponent size={32} className="text-indigo-400" />
      </div>
      <h4 className="text-sm font-bold text-zinc-100 mb-1">{title}</h4>
      <p className="text-xs text-zinc-400">{description}</p>
    </Card>
  );
}

export default AchievementCard;
