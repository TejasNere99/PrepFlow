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
import RecentlyViewedCard from '../../components/student/RecentlyViewedCard.jsx';
import BookmarksCard from '../../components/student/dashboard/BookmarksCard.jsx';
import FavoritesCard from '../../components/student/dashboard/FavoritesCard.jsx';
import CollectionsCard from '../../components/student/dashboard/CollectionsCard.jsx';
import RevisionPriorityCard from '../../components/student/dashboard/RevisionPriorityCard.jsx';
import RecommendationsCard from '../../components/student/dashboard/RecommendationsCard.jsx';
import WeakTopicsCard from '../../components/student/dashboard/WeakTopicsCard.jsx';
import LearningTimeline from '../../components/student/dashboard/LearningTimeline.jsx';
import InsightsPanel from '../../components/student/dashboard/InsightsPanel.jsx';
import StudyPlanner from '../../components/student/planner/StudyPlanner.jsx';
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

          {/* SECTION 2: Intelligent Study Planner */}
          <StudyPlanner />

          {/* SECTION 2: Smart Recommendations */}
          <div className="space-y-4">
            <RecommendationsCard />
          </div>

          {/* SECTION 3: Weak Topics */}
          <div className="space-y-4">
            <WeakTopicsCard />
          </div>

          {/* SECTION 4: Revision Priorities */}
          <div className="space-y-4">
            <RevisionPriorityCard />
          </div>

          {/* SECTION 5: Learning Insights */}
          <InsightsPanel />

          {/* Personal Workspace (Existing) */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/50">
            <h2 className="text-xl font-semibold text-zinc-100">Personal Workspace</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <CollectionsCard />
              <BookmarksCard />
              <FavoritesCard />
            </div>
          </div>

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

          {/* SECTION 6: Learning Timeline */}
          <div className="space-y-4">
            <LearningTimeline />
          </div>

          {/* SECTION 4: Weekly Activity */}
          <div className="h-64">
            <WeeklyActivityChart activity={weeklyActivity} />
          </div>

          <RecentlyViewedCard />

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
