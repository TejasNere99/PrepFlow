import { Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../ui/Badge.jsx';
import Button from '../../ui/Button.jsx';

const priorityVariant = {
  HIGH: 'danger',
  MEDIUM: 'warning',
  LOW: 'default',
};

function StudySessionCard({ task, onStatusChange }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-zinc-800/60 bg-zinc-950/70 p-4 transition-colors hover:border-zinc-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-[200px] flex-1 space-y-2 pr-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={priorityVariant[task.priority] || 'default'}>{task.priority}</Badge>
            <Badge>{task.learningStage}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
              <Clock size={13} />
              {task.estimatedMinutes} min
            </span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">{task.title}</h4>
            <p className="mt-1 text-xs text-zinc-500">{task.reason}</p>
          </div>
          <p className="text-xs text-zinc-600">
            Score {task.score} · {task.resource?.subject?.title || 'Subject'} · {task.resource?.chapter?.title || 'Chapter'}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <Button onClick={() => navigate(task.resumeUrl)} size="sm" variant="secondary">
            <ExternalLink size={14} />
            Open
          </Button>
          <Button
            disabled={task.status === 'COMPLETED' || task.status === 'SKIPPED'}
            onClick={() => onStatusChange?.(task.taskId, 'COMPLETED')}
            size="sm"
          >
            Done
          </Button>
          <Button 
            disabled={task.status === 'COMPLETED' || task.status === 'SKIPPED'}
            onClick={() => onStatusChange?.(task.taskId, 'SKIPPED')} 
            size="sm" 
            variant="ghost"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StudySessionCard;
