import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { progressApi } from '../../services/progressApi.js';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import ContinueLearningCard from '../../components/student/ContinueLearningCard.jsx';
import ProgressCard from '../../components/student/ProgressCard.jsx';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton.jsx';

function StudentDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await progressApi.getProgressSummary();
        setSummary(res.data.data);
      } catch (err) {
        console.error('Failed to fetch progress summary', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return <div className="py-12"><LoadingSkeleton rows={4} /></div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title={`Welcome back, ${user?.name || 'Student'}!`}
        description="Pick up where you left off and track your progress."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContinueLearningCard continueLearning={summary?.continueLearning} />
        </div>
        <div>
          <ProgressCard 
            title="Overall Progress" 
            completed={summary?.overallProgress?.completed || 0} 
            total={summary?.overallProgress?.total || 0} 
            percentage={summary?.overallProgress?.percentage || 0} 
          />
        </div>
      </div>

      {summary?.sheetsProgress?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100">Sheet Progress</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {summary.sheetsProgress.map(sheet => (
              <ProgressCard 
                key={sheet.id}
                title={sheet.title} 
                completed={sheet.completed} 
                total={sheet.total} 
                percentage={sheet.percentage} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
