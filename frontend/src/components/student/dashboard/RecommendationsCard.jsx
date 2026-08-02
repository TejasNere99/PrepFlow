import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningApi } from '../../../services/learningApi';
import { Sparkles, ArrowRight } from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard';
import EmptyState from '../../ui/EmptyState';
import Badge from '../../ui/Badge';

const RecommendationsCard = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await learningApi.getRecommendations();
        setRecommendations(res.data.data || []);
      } catch (error) {
        console.error('Failed to load recommendations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  return (
    <DashboardCard noPadding>
      <div className="flex justify-between items-center p-4 sm:p-5 border-b border-zinc-800/40">
        <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-400" />
          Smart Recommendations
        </h3>
      </div>
      
      {loading ? (
        <div className="text-xs text-zinc-500 animate-pulse p-4 sm:p-5">Generating recommendations...</div>
      ) : recommendations.length === 0 ? (
        <EmptyState 
          icon={Sparkles}
          title="No recommendations right now"
          description="Explore new subjects or wait until we gather more data."
        />
      ) : (
        <div className="flex flex-col">
          {recommendations.slice(0, 3).map((rec, index) => (
            <div 
              key={rec.id} 
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/20 transition-colors cursor-pointer"
              onClick={() => navigate(rec.resumeUrl)}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-medium text-indigo-400">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">{rec.reason}</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center gap-4 pl-10 sm:pl-0">
                <Badge variant={rec.priority === 'HIGH' ? 'indigo' : 'zinc'}>
                  Score: {rec.score}
                </Badge>
                <ArrowRight size={16} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default RecommendationsCard;
