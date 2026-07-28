import React from 'react';
import DashboardCard from '../ui/DashboardCard';
import { User, Clock } from 'lucide-react';

export default function ActivityTimeline({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <DashboardCard className="py-8 flex flex-col items-center justify-center text-center">
        <Clock className="text-zinc-600 mb-2" size={24} />
        <p className="text-sm text-zinc-400">No recent activity</p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard noPadding>
      <div className="p-4 border-b border-zinc-800/40">
        <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Clock size={16} className="text-zinc-500" />
          Recent Activity
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
          {activities.map((activity, index) => (
            <div key={activity._id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 group-[.is-active]:text-purple-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <User size={16} strokeWidth={1.5} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-zinc-800/60 bg-zinc-900/50 shadow">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-purple-400 px-2 py-0.5 bg-purple-500/10 rounded-full">
                    {activity.action}
                  </span>
                  <time className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    {new Date(activity.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
                <div className="text-sm text-zinc-300 mt-2">
                  <span className="font-semibold text-zinc-100">{activity.adminId?.name || 'Admin'}</span> performed {activity.action} on <strong>{activity.entityType}</strong> {activity.entityName ? `"${activity.entityName}"` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
