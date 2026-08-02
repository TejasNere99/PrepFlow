import React, { useState, useEffect } from 'react';
import { learningApi } from '../../../services/learningApi';
import { Lightbulb, TrendingUp, AlertTriangle, Medal } from 'lucide-react';

const InsightsPanel = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await learningApi.getLearningInsights();
        setInsights(res.data.data || []);
      } catch (error) {
        console.error('Failed to load insights', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading || insights.length === 0) return null;

  const getInsightConfig = (type) => {
    switch (type) {
      case 'PROGRESS':
        return { icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
      case 'CONSISTENCY':
        return { icon: Lightbulb, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
      case 'WARNING':
        return { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
      case 'ACHIEVEMENT':
        return { icon: Medal, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
      default:
        return { icon: Lightbulb, color: 'text-zinc-400', bg: 'bg-zinc-800', border: 'border-zinc-700' };
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
        <Lightbulb size={20} className="text-yellow-500" />
        Learning Insights
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {insights.map((insight, index) => {
          const { icon: Icon, color, bg, border } = getInsightConfig(insight.type);
          return (
            <div key={index} className={`p-4 rounded-xl border ${border} ${bg} flex items-start gap-4 transition-all hover:brightness-110`}>
              <div className={`mt-1 flex-shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${color} mb-1`}>{insight.title}</h4>
                <p className="text-sm text-zinc-300">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsPanel;
