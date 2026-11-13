import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'wjec_companion_mastery_v1';

const loadProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to read progress from localStorage', e);
    return {};
  }
};

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    const handleStorage = () => {
      setProgress(loadProgress());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('chempanion-progress-updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('chempanion-progress-updated', handleStorage);
    };
  }, []);

  const recordSuccess = useCallback((appletId, scenarioId = null) => {
    if (!appletId) return;
    const current = loadProgress();
    const prev = current[appletId] || { count: 0, solvedIds: [] };
    const solvedIds = Array.isArray(prev.solvedIds) ? [...prev.solvedIds] : [];
    const idStr = scenarioId !== null && scenarioId !== undefined ? String(scenarioId) : null;

    // Prevent double-counting repeated clicks on the exact same problem signature
    if (idStr !== null && solvedIds.includes(idStr)) {
      return;
    }
    if (idStr !== null) {
      solvedIds.push(idStr);
    }

    const updated = {
      ...current,
      [appletId]: {
        count: (prev.count || 0) + 1,
        solvedIds,
        lastSolvedAt: Date.now()
      }
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setProgress(updated);
      window.dispatchEvent(new CustomEvent('chempanion-progress-updated'));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, []);

  const resetProgress = useCallback((appletId = null) => {
    try {
      if (!appletId) {
        localStorage.removeItem(STORAGE_KEY);
        setProgress({});
      } else {
        const current = loadProgress();
        delete current[appletId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        setProgress(current);
      }
      window.dispatchEvent(new CustomEvent('chempanion-progress-updated'));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { progress, recordSuccess, resetProgress };
}
