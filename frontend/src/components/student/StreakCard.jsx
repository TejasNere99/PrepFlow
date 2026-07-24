import React from 'react';
import Card from '../ui/Card.jsx';
import { Flame } from 'lucide-react';

function StreakCard({ streak }) {
  const { currentStreak, longestStreak } = streak || { currentStreak: 0, longestStreak: 0 };
  
  const isActive = currentStreak > 0;

  return (
    <Card className={`relative overflow-hidden border ${isActive ? 'border-orange-500/30' : 'border-zinc-800'}`}>
      {isActive && (
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Flame size={120} className="text-orange-500" />
        </div>
      )}
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <Flame size={20} className={isActive ? 'text-orange-500' : 'text-zinc-500'} />
            Daily Streak
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            {isActive 
              ? "You're on a roll! Keep it up." 
              : "Start a new streak today by learning something!"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-8 relative z-10">
        <div>
          <p className="text-3xl font-bold text-zinc-100">{currentStreak}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-1">Current</p>
        </div>
        <div className="h-10 w-px bg-zinc-800"></div>
        <div>
          <p className="text-3xl font-bold text-zinc-300">{longestStreak}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-1">Best</p>
        </div>
      </div>
    </Card>
  );
}

export default StreakCard;
