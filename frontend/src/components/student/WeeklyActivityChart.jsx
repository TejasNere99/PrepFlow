import React from 'react';
import Card from '../ui/Card.jsx';

function WeeklyActivityChart({ activity }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Find max value to scale chart
  const maxActivity = Math.max(1, ...(activity ? Object.values(activity) : []));

  return (
    <Card className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-zinc-100 mb-6">Weekly Activity</h3>
      <div className="flex-1 flex items-end justify-between gap-2 mt-auto">
        {days.map((day) => {
          const value = activity?.[day] || 0;
          const heightPercent = Math.max(5, (value / maxActivity) * 100);
          
          return (
            <div key={day} className="flex flex-col items-center gap-2 flex-1 group">
              <div className="w-full relative flex justify-center h-32 items-end">
                {/* Tooltip */}
                <div className="absolute -top-8 bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {value} Resources
                </div>
                {/* Bar */}
                <div 
                  className={`w-full max-w-[2rem] rounded-t-sm transition-all duration-500 ${value > 0 ? 'bg-indigo-500 group-hover:bg-indigo-400' : 'bg-zinc-800'}`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-zinc-500">{day}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default WeeklyActivityChart;
