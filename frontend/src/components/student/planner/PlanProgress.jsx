import ProgressBar from '../../ui/ProgressBar.jsx';

function PlanProgress({ progress, totalEstimatedMinutes }) {
  return (
    <div className="space-y-3 rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-100">Plan Progress</p>
          <p className="text-xs text-zinc-500">
            {progress?.completed || 0} of {progress?.total || 0} tasks complete
          </p>
        </div>
        <span className="text-sm font-semibold text-zinc-300">{totalEstimatedMinutes || 0} min</span>
      </div>
      <ProgressBar value={progress?.percentage || 0} />
    </div>
  );
}

export default PlanProgress;
