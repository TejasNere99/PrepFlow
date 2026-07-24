import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card.jsx';
import { Clock, PlayCircle } from 'lucide-react';
import { progressApi } from '../../services/progressApi.js';

function RecentlyViewedCard() {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await progressApi.getRecentActivity();
        setRecent(res.data.data || []);
      } catch (err) {
        console.error('Failed to load recent activity', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) {
    return (
      <Card className="h-64 flex items-center justify-center border border-zinc-800">
        <span className="text-zinc-500 text-sm">Loading recent activity...</span>
      </Card>
    );
  }

  if (recent.length === 0) {
    return (
      <Card className="h-64 flex flex-col items-center justify-center border border-zinc-800 text-center">
        <Clock className="text-zinc-600 mb-2" size={32} />
        <p className="text-zinc-400 text-sm">No recent activity</p>
        <p className="text-zinc-500 text-xs mt-1">Resources you open will appear here.</p>
      </Card>
    );
  }

  return (
    <Card className="border border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
        <Clock size={20} className="text-zinc-400" />
        Recently Viewed
      </h3>
      <div className="space-y-3">
        {recent.map((item) => (
          <button
            key={item._id}
            onClick={() => navigate(`/resources/${item.slug}`)}
            className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors text-left group"
          >
            <PlayCircle size={20} className="text-zinc-500 group-hover:text-indigo-400 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-200 truncate">{item.title}</p>
              <p className="text-xs text-zinc-500 truncate mt-0.5">
                {item.sheet?.title} &gt; {item.chapter?.title}
              </p>
            </div>
            <span className="text-[10px] text-zinc-600 shrink-0 uppercase tracking-wider mt-1">
              {new Date(item.lastAccessedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

export default RecentlyViewedCard;
