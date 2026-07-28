import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../ui/DashboardCard';
import ListItem from '../ui/ListItem';
import EmptyState from '../ui/EmptyState';
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

  return (
    <DashboardCard noPadding>
      <div className="flex justify-between items-center p-4 sm:p-5 border-b border-zinc-800/40">
        <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Clock size={16} className="text-zinc-500" />
          Recently Viewed
        </h3>
      </div>
      
      {loading ? (
        <div className="text-xs text-zinc-500 animate-pulse p-4 sm:p-5">Loading...</div>
      ) : recent.length === 0 ? (
        <EmptyState 
          icon={Clock}
          title="No recent activity"
          description="Resources you open will appear here."
        />
      ) : (
        <div className="flex flex-col">
          {recent.map((item) => (
            <ListItem 
              key={item._id}
              title={item.title}
              subtitle={`${item.sheet?.title || 'Unknown'} > ${item.chapter?.title || 'Unknown'}`}
              icon={PlayCircle}
              onClick={() => navigate(`/resources/${item.slug}`)}
              action={
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  {new Date(item.lastAccessedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              }
            />
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

export default RecentlyViewedCard;
