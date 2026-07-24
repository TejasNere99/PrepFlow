import React, { createContext, useContext, useState, useEffect } from 'react';
import { progressApi } from '../services/progressApi.js';
import { useAuth } from './AuthContext.jsx';

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [completedResources, setCompletedResources] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const refreshProgress = async () => {
    if (!user || user.role !== 'STUDENT') {
      setCompletedResources(new Set());
      return;
    }
    
    setLoading(true);
    try {
      const response = await progressApi.getProgressSummary();
      const completed = response.data.data.completedResources || [];
      setCompletedResources(new Set(completed));
    } catch (err) {
      console.error('Failed to fetch progress summary', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProgress();
  }, [user]);

  const updateProgress = async (resourceId, completed) => {
    try {
      setCompletedResources(prev => {
        const next = new Set(prev);
        if (completed) next.add(resourceId);
        else next.delete(resourceId);
        return next;
      });
      await progressApi.upsertProgress(resourceId, { completed });
      setLastUpdated(Date.now());
    } catch (err) {
      console.error('Failed to update progress', err);
      refreshProgress();
    }
  };

  const value = {
    completedResources,
    loading,
    lastUpdated,
    refreshProgress,
    updateProgress
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
