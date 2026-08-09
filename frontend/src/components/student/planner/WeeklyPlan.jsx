import { CalendarRange } from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard.jsx';
import EmptyState from '../../ui/EmptyState.jsx';
import Badge from '../../ui/Badge.jsx';

const dayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

function WeeklyPlan({ loading, plan }) {
  const days = plan?.days || [];
  const hasTasks = days.some((day) => day.tasks.length > 0);

  return (
    <DashboardCard noPadding>
      <div className="border-b border-zinc-800/40 p-4 sm:p-5">
        <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-100">
          <CalendarRange size={16} className="text-zinc-500" />
          Weekly Plan
        </h3>
      </div>

      {loading ? (
        <div className="p-4 text-xs text-zinc-500">Distributing study sessions...</div>
      ) : !hasTasks ? (
        <EmptyState
          icon={CalendarRange}
          title="No weekly tasks yet"
          description="Generate a plan after more resources or progress are available."
        />
      ) : (
        <div className="divide-y divide-zinc-800/40">
          {days.map((day) => (
            <div className="p-4" key={day.date}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-200">
                  {dayFormatter.format(new Date(day.date))}
                </p>
                <span className="text-xs text-zinc-500">{day.totalEstimatedMinutes || 0} min</span>
              </div>
              {day.tasks.length === 0 ? (
                <p className="text-xs text-zinc-600">No planned study session.</p>
              ) : (
                <div className="space-y-2">
                  {day.tasks.slice(0, 3).map((task) => (
                    <div className="flex items-center justify-between gap-3" key={task.taskId}>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-zinc-300">{task.title}</p>
                        <p className="text-[11px] text-zinc-600">{task.estimatedMinutes} min</p>
                      </div>
                      <Badge variant={task.priority === 'HIGH' ? 'danger' : 'default'}>{task.priority}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

export default WeeklyPlan;
