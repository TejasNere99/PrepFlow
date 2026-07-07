function ProgressBar({ value = 0, label }) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>{label}</span>
          <span>{normalizedValue}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
        <div
          className="h-full rounded-full bg-zinc-100 transition-[width] duration-300"
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
