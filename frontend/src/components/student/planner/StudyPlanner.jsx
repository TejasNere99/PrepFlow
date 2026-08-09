import { useCallback, useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { plannerApi } from '../../../services/plannerApi.js';
import Button from '../../ui/Button.jsx';
import DailyPlanCard from './DailyPlanCard.jsx';
import PlannerSettingsModal from './PlannerSettingsModal.jsx';
import WeeklyPlan from './WeeklyPlan.jsx';

function StudyPlanner() {
  const [dailyPlan, setDailyPlan] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [settings, setSettings] = useState({ dailyStudyMinutes: 120 });
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const loadPlans = useCallback(async (nextSettings = settings, showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [todayResponse, weekResponse] = await Promise.all([
        plannerApi.getTodayPlan(nextSettings),
        plannerApi.getWeeklyPlan(nextSettings),
      ]);
      setDailyPlan(todayResponse.data.data);
      setWeeklyPlan(weekResponse.data.data);
    } catch (error) {
      console.error('Failed to load planner', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleSaveSettings = async (nextSettings) => {
    setSettings(nextSettings);
    setIsSettingsOpen(false);
    const response = await plannerApi.generatePlan({ ...nextSettings, planType: 'DAILY' });
    setDailyPlan(response.data.data);
    const weeklyResponse = await plannerApi.generatePlan({ ...nextSettings, planType: 'WEEKLY' });
    setWeeklyPlan(weeklyResponse.data.data);
  };

  const handleRegenerate = async () => {
    const response = await plannerApi.regeneratePlan({ ...settings, planType: 'DAILY' });
    setDailyPlan(response.data.data);
  };

  const handleStatusChange = async (taskId, status) => {
    // 1. Optimistic UI Update
    setDailyPlan((prevPlan) => {
      if (!prevPlan) return prevPlan;
      
      const newPlan = { ...prevPlan };
      
      if (newPlan.tasks) {
        newPlan.tasks = newPlan.tasks.map(t => t.taskId === taskId ? { ...t, status } : t);
      }
      
      if (newPlan.days && newPlan.days.length > 0) {
        newPlan.days[0] = { ...newPlan.days[0] };
        newPlan.days[0].tasks = newPlan.days[0].tasks.map(t => 
          t.taskId === taskId ? { ...t, status } : t
        );
      }
      
      return newPlan;
    });

    try {
      // 2. If the plan is dynamic (no id), persist it first
      if (!dailyPlan?.id) {
        await plannerApi.generatePlan({ ...settings, planType: 'DAILY' });
      }

      // 3. Perform API request
      await plannerApi.updateTask(taskId, { status });
      
      // 4. Background sync without showing loading spinner
      loadPlans(settings, false);
    } catch (error) {
      console.error('Failed to update task status', error);
      // Revert by doing a background sync
      loadPlans(settings, false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">Intelligent Study Planner</h2>
          <p className="mt-1 text-sm text-zinc-500">A deterministic plan for what to study next.</p>
        </div>
        <Button onClick={() => setIsSettingsOpen(true)} size="sm" variant="secondary">
          <Settings size={14} />
          Settings
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <DailyPlanCard
          loading={loading}
          onRegenerate={handleRegenerate}
          onStatusChange={handleStatusChange}
          plan={dailyPlan}
        />
        <WeeklyPlan loading={loading} plan={weeklyPlan} />
      </div>

      <PlannerSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        settings={settings}
      />
    </section>
  );
}

export default StudyPlanner;
