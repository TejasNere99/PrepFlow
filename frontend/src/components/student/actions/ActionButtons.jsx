import React, { useState } from 'react';
import { studentService } from '../../../services/studentService';
import { Bookmark, Heart } from 'lucide-react';
import IconButton from '../../ui/IconButton';

const ActionButtons = ({ resourceId, preferences, onChange }) => {
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await studentService.toggleBookmark(resourceId);
      onChange && onChange(result);
    } catch (error) {
      console.error('Failed to toggle bookmark', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await studentService.toggleFavorite(resourceId);
      onChange && onChange(result);
    } catch (error) {
      console.error('Failed to toggle favorite', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <IconButton 
        icon={Bookmark}
        active={preferences?.isBookmarked}
        activeColorClass="text-zinc-100 bg-zinc-800/80 border-zinc-700"
        label={preferences?.isBookmarked ? 'Remove Bookmark' : 'Bookmark Resource'}
        onClick={handleBookmark}
        disabled={loading}
      />
      <IconButton 
        icon={Heart}
        active={preferences?.isFavorite}
        activeColorClass="text-rose-400 bg-rose-500/10 border-rose-500/20"
        label={preferences?.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        onClick={handleFavorite}
        disabled={loading}
      />
    </div>
  );
};

export default ActionButtons;
