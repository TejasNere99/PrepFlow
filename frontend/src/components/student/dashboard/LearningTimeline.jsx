import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningApi } from '../../../services/learningApi';
import { Activity, CheckCircle2, Eye, Bookmark, Heart, PenTool, Folder, RotateCcw } from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard';

const LearningTimeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await learningApi.getTimeline();
        setEvents(res.data.data || []);
      } catch (error) {
        console.error('Failed to load timeline', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const getEventConfig = (eventType) => {
    switch (eventType) {
      case 'RESOURCE_COMPLETED':
        return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' };
      case 'RESOURCE_VIEWED':
        return { icon: Eye, color: 'text-zinc-400', bg: 'bg-zinc-800' };
      case 'BOOKMARK_ADDED':
        return { icon: Bookmark, color: 'text-indigo-400', bg: 'bg-indigo-500/10' };
      case 'FAVORITE_ADDED':
        return { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10' };
      case 'NOTE_CREATED':
        return { icon: PenTool, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
      case 'COLLECTION_CREATED':
        return { icon: Folder, color: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'REVISION_COMPLETED':
        return { icon: RotateCcw, color: 'text-orange-500', bg: 'bg-orange-500/10' };
      default:
        return { icon: Activity, color: 'text-zinc-500', bg: 'bg-zinc-800' };
    }
  };

  const handleEventClick = (ev) => {
    if (ev.metadata?.slug) {
      navigate(`/resources/${ev.metadata.slug}`);
    } else if (ev.metadata?.collectionId) {
      navigate(`/student/collections`);
    }
  };

  const formatTimeAgo = (dateStr) => {
    const diff = new Date() - new Date(dateStr);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes || 1}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <DashboardCard noPadding>
      <div className="flex justify-between items-center p-4 sm:p-5 border-b border-zinc-800/40">
        <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Activity size={16} className="text-zinc-500" />
          Learning Timeline
        </h3>
      </div>
      
      {loading ? (
        <div className="p-5 text-sm text-zinc-500 animate-pulse">Loading timeline...</div>
      ) : events.length === 0 ? (
        <div className="p-5 text-sm text-zinc-500 text-center">No recent activity.</div>
      ) : (
        <div className="p-5">
          <div className="relative border-l border-zinc-800 ml-3 space-y-6">
            {events.map((ev, idx) => {
              const { icon: Icon, color, bg } = getEventConfig(ev.eventType);
              return (
                <div key={idx} className="relative pl-6 group cursor-pointer" onClick={() => handleEventClick(ev)}>
                  <div className={`absolute -left-3 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 ${bg} ${color}`}>
                    <Icon size={12} />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <p className="text-sm text-zinc-300 group-hover:text-indigo-400 transition-colors">
                      {ev.title}
                    </p>
                    <span className="text-xs text-zinc-500 shrink-0">
                      {formatTimeAgo(ev.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardCard>
  );
};

export default LearningTimeline;
