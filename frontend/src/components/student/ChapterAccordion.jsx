import { useState, useEffect } from 'react';
import { publicApi } from '../../services/publicApi.js';
import ResourceCard from './ResourceCard.jsx';

function ChapterAccordion({ chapter, searchQuery }) {
  const [isOpen, setIsOpen] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && resources.length === 0) {
      loadResources();
    }
  }, [isOpen]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getResources(chapter._id, { limit: 100 });
      setResources(data.data || []);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(res => 
    !searchQuery || 
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // If there's a search query and this chapter doesn't match the query, 
  // we still might want to show it if its resources match.
  // In the parent, we'll decide whether to render the accordion at all.

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-zinc-900/50 p-4 transition-colors hover:bg-zinc-900 text-left"
      >
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">{chapter.title}</h3>
          {chapter.description && (
            <p className="mt-1 text-sm text-zinc-400">{chapter.description}</p>
          )}
        </div>
        <div className="ml-4 flex items-center justify-center h-8 w-8 rounded-full bg-zinc-800 text-zinc-400">
          <svg
            className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-zinc-800 p-4">
          {loading ? (
            <div className="text-center text-sm text-zinc-400 py-4">Loading resources...</div>
          ) : filteredResources.length > 0 ? (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-zinc-500 py-4">
              {searchQuery ? 'No resources match your search in this chapter.' : 'No resources available in this chapter.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChapterAccordion;
