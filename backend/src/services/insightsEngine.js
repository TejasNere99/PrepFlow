export const generateInsights = (stats) => {
  const insights = [];

  if (stats.completedThisWeek > 0) {
    insights.push({
      type: 'ACTIVITY',
      title: 'Weekly Progress',
      message: `You completed ${stats.completedThisWeek} resources this week. Keep up the momentum!`,
      priority: 1
    });
  }

  let strongest = null;
  let highestPercentage = -1;
  for (const sheet of stats.sheetsProgress) {
    if (sheet.percentage > highestPercentage && sheet.completed > 0) {
      highestPercentage = sheet.percentage;
      strongest = sheet.title;
    }
  }

  if (strongest) {
    insights.push({
      type: 'STRENGTH',
      title: 'Strong Area',
      message: `${strongest} is your strongest sheet right now at ${highestPercentage}%.`,
      priority: 2
    });
  }

  // Find a sheet that is close to completion (e.g. > 80% but < 100%)
  const nearComplete = stats.sheetsProgress.find(s => s.percentage >= 80 && s.percentage < 100);
  if (nearComplete) {
    const remaining = nearComplete.total - nearComplete.completed;
    insights.push({
      type: 'MOTIVATION',
      title: 'Almost There',
      message: `Only ${remaining} resources left to complete ${nearComplete.title}.`,
      priority: 3
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
};

export const generateNextGoal = (stats) => {
  if (stats.overallTotal === 0) {
    return {
      title: 'Start Learning',
      message: 'Open any sheet and complete your first resource.'
    };
  }

  // Look for a sheet near completion first
  let activeSheets = stats.sheetsProgress.filter(s => s.percentage > 0 && s.percentage < 100);
  
  let nearComplete = null;
  if (activeSheets.length > 0) {
    if (stats.lastAccessedSheetId) {
      // Prioritize the recently accessed sheet if it is active
      nearComplete = activeSheets.find(s => s.id.toString() === stats.lastAccessedSheetId);
    }
    
    if (!nearComplete) {
      activeSheets.sort((a, b) => b.percentage - a.percentage); // Highest percentage first
      nearComplete = activeSheets[0];
    }
  }

  if (nearComplete) {
    const nextPercent = Math.ceil((nearComplete.percentage + 0.1) / 25) * 25; // Next 25% boundary
    const targetPercentage = nextPercent > 100 ? 100 : nextPercent;
    
    if (targetPercentage === 100) {
      return {
        title: 'Finish Strong',
        message: `Finish ${nearComplete.title}`
      };
    } else {
      const needed = Math.ceil((targetPercentage / 100) * nearComplete.total) - nearComplete.completed;
      if (needed > 0) {
        return {
          title: 'Sheet Milestone',
          message: `Complete ${needed} more resources in ${nearComplete.title}`
        };
      }
    }
  }

  const nextPercent = Math.ceil((stats.overallPercentage + 1) / 10) * 10;
  if (nextPercent <= 100) {
    const needed = Math.ceil((nextPercent / 100) * stats.overallTotal) - stats.overallCompleted;
    if (needed > 0) {
      return {
        title: 'Overall Milestone',
        message: `Complete ${needed} more resources to reach ${nextPercent}% overall progress`
      };
    }
  }

  return {
    title: 'Keep Going',
    message: 'Continue your learning journey.'
  };
};
