import React from 'react';
import Card from '../ui/Card.jsx';
import { Compass } from 'lucide-react';

function NextGoalCard({ nextGoal }) {
  if (!nextGoal) return null;

  return (
    <Card className="border border-purple-500/30 bg-gradient-to-r from-zinc-900/80 to-purple-950/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Compass size={100} />
      </div>
      <div className="relative z-10 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
          <Compass size={24} />
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-400 mb-1">Next Goal</h3>
          <p className="text-lg font-bold text-zinc-100 mb-1">{nextGoal.title}</p>
          <p className="text-sm text-zinc-300">{nextGoal.message}</p>
        </div>
      </div>
    </Card>
  );
}

export default NextGoalCard;
