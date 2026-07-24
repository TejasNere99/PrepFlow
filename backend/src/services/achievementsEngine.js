const ACHIEVEMENTS_CONFIG = [
  {
    id: 'FIRST_RESOURCE',
    title: 'First Step',
    description: 'First Resource Completed',
    icon: 'Star',
    check: (stats) => stats.overallCompleted >= 1
  },
  {
    id: 'TEN_RESOURCES',
    title: 'Getting Warm',
    description: '10 Resources Completed',
    icon: 'Award',
    check: (stats) => stats.overallCompleted >= 10
  },
  {
    id: 'ONE_HUNDRED_RESOURCES',
    title: 'Centurion',
    description: '100 Resources Completed',
    icon: 'Trophy',
    check: (stats) => stats.overallCompleted >= 100
  },
  {
    id: 'HALF_SHEET',
    title: 'Halfway There',
    description: '50% Sheet Complete',
    icon: 'Target',
    check: (stats) => stats.sheetsProgress.some(s => s.percentage >= 50 && s.total > 0)
  },
  {
    id: 'FULL_SHEET',
    title: 'Mastery',
    description: '100% Sheet Complete',
    icon: 'Crown',
    check: (stats) => stats.sheetsProgress.some(s => s.percentage >= 100 && s.total > 0)
  }
];

export const evaluateAchievements = (stats) => {
  return ACHIEVEMENTS_CONFIG
    .filter(achievement => achievement.check(stats))
    .map(({ id, title, description, icon }) => ({ id, title, description, icon }));
};
