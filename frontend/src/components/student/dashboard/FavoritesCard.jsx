import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentService } from '../../../services/studentService';
import { Heart } from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard';
import ListItem from '../../ui/ListItem';
import EmptyState from '../../ui/EmptyState';

const FavoritesCard = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await studentService.getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error('Failed to load favorites', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const navigate = useNavigate();

  return (
    <DashboardCard noPadding>
      <div className="flex justify-between items-center p-4 sm:p-5 border-b border-zinc-800/40">
        <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Heart size={16} className="text-zinc-500" />
          Favorites
        </h3>
      </div>
      
      {loading ? (
        <div className="text-xs text-zinc-500 animate-pulse p-4 sm:p-5">Loading...</div>
      ) : favorites.length === 0 ? (
        <EmptyState 
          icon={Heart}
          title="No favorites yet"
          description="Like resources to keep them here."
        />
      ) : (
        <div className="flex flex-col">
          {favorites.slice(0, 5).map(f => (
            <ListItem 
              key={f.resourceId._id}
              title={f.resourceId.title}
              subtitle={f.resourceId.resourceType}
              onClick={() => navigate(`/resources/${f.resourceId.slug}`)}
            />
          ))}
          {favorites.length > 5 && (
            <div className="p-3 text-xs text-zinc-500 text-center hover:text-zinc-400 cursor-pointer transition-colors border-t border-zinc-800/40 bg-zinc-950/30">
              View all {favorites.length} favorites
            </div>
          )}
        </div>
      )}
    </DashboardCard>
  );
};

export default FavoritesCard;
