import React, { useEffect, useState } from 'react';
import { Database, FileText, LayoutList, Layers } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import AnalyticsCard from '../components/admin/AnalyticsCard.jsx';
import ActivityTimeline from '../components/admin/ActivityTimeline.jsx';
import { adminService } from '../services/adminService.js';
import ErrorState from '../components/ui/ErrorState.jsx';
import Loader from '../components/ui/Loader.jsx';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, activityRes] = await Promise.all([
          adminService.getAnalytics(),
          adminService.getActivityLogs(20)
        ]);
        
        setAnalytics(analyticsRes.data);
        setActivity(activityRes.data.logs);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader /></div>;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!analytics) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SectionHeader
        title="Admin Workspace"
        description="Overview of all content and recent administrative activities."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard title="Total Sheets" data={analytics.sheets} icon={Database} />
        <AnalyticsCard title="Total Subjects" data={analytics.subjects} icon={LayoutList} />
        <AnalyticsCard title="Total Chapters" data={analytics.chapters} icon={Layers} />
        <AnalyticsCard title="Total Resources" data={analytics.resources} icon={FileText} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader title="Recent Activity" description="Audit log of recent content changes." />
          <ActivityTimeline activities={activity} />
        </div>
        
        <div className="space-y-6">
          <SectionHeader title="Recently Added Resources" description="Quick look at the newest content." />
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800/50">
            {analytics.recentResources?.length > 0 ? (
              analytics.recentResources.map((res) => (
                <div key={res.id} className="p-4 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{res.title}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {new Date(res.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      res.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' :
                      res.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-zinc-500 text-sm">No recent resources</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
