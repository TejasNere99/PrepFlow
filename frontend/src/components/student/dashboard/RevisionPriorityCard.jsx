import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningApi } from '../../../services/learningApi';
import { CalendarClock } from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard';
import ListItem from '../../ui/ListItem';
import EmptyState from '../../ui/EmptyState';
import Badge from '../../ui/Badge';

const RevisionPriorityCard = () => {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const res = await learningApi.getRevisionPriorities();
        setPriorities(res.data.data || []);
      } catch (error) {
        console.error('Failed to load revision priorities', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPriorities();
  }, []);

  const getBadgeColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'orange';
      case 'LOW': return 'yellow';
      default: return 'zinc';
    }
  };

  return (
    <DashboardCard noPadding>
      <div className="flex justify-between items-center p-4 sm:p-5 border-b border-zinc-800/40">
        <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <CalendarClock size={16} className="text-zinc-500" />
          Revision Priorities
        </h3>
      </div>
      
      {loading ? (
        <div className="text-xs text-zinc-500 animate-pulse p-4 sm:p-5">Loading priorities...</div>
      ) : priorities.length === 0 ? (
        <EmptyState 
          icon={CalendarClock}
          title="No pending revisions"
          description="You're all caught up! Schedule more resources to review."
        />
      ) : (
        <div className="flex flex-col">
          {priorities.slice(0, 5).map(p => {
            const isOverdue = new Date(p.dueDate) < new Date();
            const dateStr = new Date(p.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            
            return (
              <ListItem 
                key={p.id}
                title={p.resource.title}
                description={`${p.chapter.title} • Due: ${dateStr}`}
                onClick={() => navigate(`/resources/${p.resource.slug}`)}
                action={
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={getBadgeColor(p.priority)}>{isOverdue ? 'OVERDUE' : p.priority}</Badge>
                    <span className="text-[10px] text-zinc-500">Score: {p.priorityScore}</span>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
};

export default RevisionPriorityCard;
