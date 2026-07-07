function Loader({ label = 'Loading' }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-zinc-400" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
      <span>{label}</span>
    </div>
  );
}

export default Loader;
