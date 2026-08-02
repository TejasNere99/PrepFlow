import React, { useState, useEffect } from 'react';
import { learningApi } from '../../../services/learningApi';
import { AlertCircle } from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard';
import ListItem from '../../ui/ListItem';
import EmptyState from '../../ui/EmptyState';
import Badge from '../../ui/Badge';
import { useNavigate } from 'react-router-dom';

const WeakTopicsCard = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await learningApi.getWeakTopics();
        setTopics(res.data.data || []);
      } catch (error) {
        console.error('Failed to load weak topics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
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
          <AlertCircle size={16} className="text-zinc-500" />
          Weak Topics
        </h3>
      </div>
      
      {loading ? (
        <div className="text-xs text-zinc-500 animate-pulse p-4 sm:p-5">Analyzing progress...</div>
      ) : topics.length === 0 ? (
        <EmptyState 
          icon={AlertCircle}
          title="No weak topics found"
          description="Great job! Keep up the consistent study pace."
        />
      ) : (
        <div className="flex flex-col">
          {topics.slice(0, 5).map(t => (
            <div 
              key={t.chapterId} 
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/20 transition-colors ${t.sheetSlug ? 'cursor-pointer' : ''}`}
              onClick={() => { if (t.sheetSlug) navigate(`/sheets/${t.sheetSlug}`); }}
            >
              <div>
                <h4 className="text-sm font-medium text-zinc-200">{t.chapterTitle}</h4>
                <p className="text-xs text-zinc-500 mt-1">{t.subjectName} • {t.completionPercentage}% Complete</p>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-1">Score</span>
                  <span className="text-sm font-bold text-zinc-300">{t.weaknessScore}</span>
                </div>
                <Badge variant={getBadgeColor(t.priority)}>{t.priority}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default WeakTopicsCard;
