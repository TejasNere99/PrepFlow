import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { progressApi } from '../../services/progressApi.js';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton.jsx';

import StatCard from '../../components/student/StatCard.jsx';
import StreakCard from '../../components/student/StreakCard.jsx';
import WeeklyActivityChart from '../../components/student/WeeklyActivityChart.jsx';
import InsightCard from '../../components/student/InsightCard.jsx';
import AchievementCard from '../../components/student/AchievementCard.jsx';
import NextGoalCard from '../../components/student/NextGoalCard.jsx';
import ContinueLearningCard from '../../components/student/ContinueLearningCard.jsx';
import { BookOpen, CheckCircle, Target } from 'lucide-react';

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
    return <div className="py-12"><LoadingSkeleton rows={6} /></div>;
  }

  const {
    overallProgress = { completed: 0, total: 0, percentage: 0 },
    streak,
    weeklyActivity,
    insights = [],
    achievements = [],
    nextGoal,
    continueLearning
  } = summary || {};

  return (
    <div className="space-y-10 pb-12">
      <SectionHeader
        title={`Welcome back, ${user?.name || 'Student'}!`}
        description="Here are your learning insights and progress."
      />

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Left Column (Main) */}
        <div className="md:col-span-8 space-y-8">
          
          {/* SECTION 1: Learning Overview */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard 
              title="Overall Progress" 
              value={`${overallProgress.percentage}%`} 
              icon={Target} 
              color="indigo" 
            />
            <StatCard 
              title="Completed" 
              value={overallProgress.completed} 
              icon={CheckCircle} 
              color="green" 
            />
            <StatCard 
              title="Remaining" 
              value={Math.max(0, overallProgress.total - overallProgress.completed)} 
              icon={BookOpen} 
              color="orange" 
            />
          </div>

          {/* Continue & Next Goal */}
          <div className="grid gap-6 sm:grid-cols-2">
            <ContinueLearningCard continueLearning={continueLearning} />
            <NextGoalCard nextGoal={nextGoal} />
          </div>

          {/* SECTION 2: Insights */}
          {insights.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-100">Insights for You</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {insights.map((insight, index) => (
                  <InsightCard key={index} insight={insight} />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: Achievements */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-100">Achievements</h2>
            {achievements.length > 0 ? (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                {achievements.map((ach) => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-zinc-900/30 rounded-xl border border-zinc-800">
                <p className="text-sm text-zinc-500">Keep learning to unlock achievements.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="md:col-span-4 space-y-8">
          
          {/* SECTION 3: Streak */}
          <StreakCard streak={streak} />

          {/* SECTION 4: Weekly Activity */}
          <div className="h-64">
            <WeeklyActivityChart activity={weeklyActivity} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
