import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentService } from '../../../services/studentService';
import { Bookmark } from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard';
import ListItem from '../../ui/ListItem';
import EmptyState from '../../ui/EmptyState';

const BookmarksCard = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await studentService.getBookmarks();
        setBookmarks(data);
      } catch (error) {
        console.error('Failed to load bookmarks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const navigate = useNavigate();

  return (
    <DashboardCard noPadding>
      <div className="flex justify-between items-center p-4 sm:p-5 border-b border-zinc-800/40">
        <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Bookmark size={16} className="text-zinc-500" />
          Bookmarks
        </h3>
      </div>
      
      {loading ? (
        <div className="text-xs text-zinc-500 animate-pulse p-4 sm:p-5">Loading...</div>
      ) : bookmarks.length === 0 ? (
        <EmptyState 
          icon={Bookmark}
          title="No bookmarks yet"
          description="Save resources you want to find quickly later."
        />
      ) : (
        <div className="flex flex-col">
          {bookmarks.slice(0, 5).map(b => (
            <ListItem 
              key={b.resourceId._id}
              title={b.resourceId.title}
              subtitle={b.resourceId.resourceType}
              onClick={() => navigate(`/resources/${b.resourceId.slug}`)}
            />
          ))}
          {bookmarks.length > 5 && (
            <div className="p-3 text-xs text-zinc-500 text-center hover:text-zinc-400 cursor-pointer transition-colors border-t border-zinc-800/40 bg-zinc-950/30">
              View all {bookmarks.length} bookmarks
            </div>
          )}
        </div>
      )}
    </DashboardCard>
  );
};

export default BookmarksCard;
