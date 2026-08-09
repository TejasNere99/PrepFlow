import { CalendarDays, RotateCcw } from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard.jsx';
import EmptyState from '../../ui/EmptyState.jsx';
import Button from '../../ui/Button.jsx';
import StudySessionCard from './StudySessionCard.jsx';
import PlanProgress from './PlanProgress.jsx';

function DailyPlanCard({ loading, plan, onRegenerate, onStatusChange }) {
  const tasks = plan?.days?.[0]?.tasks || plan?.tasks || [];

  return (
    <DashboardCard noPadding>
      <div className="flex items-center justify-between border-b border-zinc-800/40 p-4 sm:p-5">
        <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-100">
          <CalendarDays size={16} className="text-indigo-400" />
          Today's Study Plan
        </h3>
        <Button disabled={loading} onClick={onRegenerate} size="sm" variant="ghost">
          <RotateCcw size={14} />
          Regenerate
        </Button>
      </div>

      {loading ? (
        <div className="p-4 text-xs text-zinc-500">Preparing your study plan...</div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No tasks planned"
          description="Add active resources or track progress to receive a useful plan."
        />
      ) : (
        <div className="space-y-4 p-4 sm:p-5">
          <PlanProgress progress={plan.progress} totalEstimatedMinutes={plan.totalEstimatedMinutes} />
          <div className="space-y-3">
            {tasks.map((task) => (
              <StudySessionCard key={task.taskId} onStatusChange={onStatusChange} task={task} />
            ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}

export default DailyPlanCard;
