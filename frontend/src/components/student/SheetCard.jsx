import { Link } from 'react-router-dom';

function SheetCard({ sheet }) {
  return (
    <Link
      to={`/sheets/${sheet.slug}`}
      className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-indigo-500/50 hover:bg-zinc-900"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400">
          {sheet.title}
        </h3>
        {sheet.metadata?.estimatedHours && (
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
            {sheet.metadata.estimatedHours} hrs
          </span>
        )}
      </div>
      
      <p className="mb-6 line-clamp-2 flex-1 text-sm text-zinc-400">
        {sheet.description || 'No description provided.'}
      </p>

      {sheet.tags && sheet.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {sheet.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="rounded bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-400"
            >
              {tag}
            </span>
          ))}
          {sheet.tags.length > 3 && (
            <span className="rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-400">
              +{sheet.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center text-sm font-medium text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100">
        Start Preparation
        <svg
          className="ml-1 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}

export default SheetCard;
