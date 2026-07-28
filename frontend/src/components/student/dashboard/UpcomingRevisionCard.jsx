import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentService } from '../../../services/studentService';
import { CalendarClock } from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard';
import ListItem from '../../ui/ListItem';
import EmptyState from '../../ui/EmptyState';
import Badge from '../../ui/Badge';

const UpcomingRevisionCard = () => {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevisions = async () => {
      try {
        const data = await studentService.getUpcomingRevisions();
        setRevisions(data);
      } catch (error) {
        console.error('Failed to load revisions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevisions();
  }, []);

  const navigate = useNavigate();

  return (
    <DashboardCard noPadding>
      <div className="flex justify-between items-center p-4 sm:p-5 border-b border-zinc-800/40">
        <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <CalendarClock size={16} className="text-zinc-500" />
          Upcoming Revision
        </h3>
      </div>
      
      {loading ? (
        <div className="text-xs text-zinc-500 animate-pulse p-4 sm:p-5">Loading...</div>
      ) : revisions.length === 0 ? (
        <EmptyState 
          icon={CalendarClock}
          title="No pending revisions"
          description="You're all caught up! Schedule more resources to review."
        />
      ) : (
        <div className="flex flex-col">
          {revisions.slice(0, 5).map(r => (
            <ListItem 
              key={r._id}
              title={r.resourceId.title}
              onClick={() => navigate(`/resources/${r.resourceId.slug}`)}
              action={
                <Badge variant="indigo">
                  {new Date(r.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </Badge>
              }
            />
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default UpcomingRevisionCard;
