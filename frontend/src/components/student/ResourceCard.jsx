function ResourceCard({ resource }) {
  const handleOpen = () => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else if (resource.storageUrl) {
      window.open(resource.storageUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition-colors hover:bg-zinc-900/80">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold uppercase text-indigo-400 border border-indigo-500/20">
            {resource.resourceType || 'Resource'}
          </span>
          <h4 className="text-base font-medium text-zinc-100">{resource.title}</h4>
        </div>
        {resource.description && (
          <p className="text-sm text-zinc-400 line-clamp-2">{resource.description}</p>
        )}
        {resource.tags && resource.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {resource.tags.map((tag, i) => (
              <span key={i} className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={handleOpen}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
        >
          Open Resource
        </button>
      </div>
    </div>
  );
}

export default ResourceCard;
