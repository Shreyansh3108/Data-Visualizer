import { useState, useEffect, useCallback } from 'react';
import { LIVE_MODE_INTERVAL } from '../utils/constants';

export const useLiveMode = (currentDataLength) => {
  const [showLiveMode, setShowLiveMode] = useState(false);
  const [liveDataIndex, setLiveDataIndex] = useState(0);

  useEffect(() => {
    if (showLiveMode && liveDataIndex < currentDataLength) {
      const timer = setTimeout(() => {
        setLiveDataIndex(prev => prev + 1);
      }, LIVE_MODE_INTERVAL);
      return () => clearTimeout(timer);
    }
  }, [showLiveMode, liveDataIndex, currentDataLength]);

  const toggleLiveMode = useCallback(() => {
    if (!showLiveMode) {
      setLiveDataIndex(0);
      setShowLiveMode(true);
    } else {
      setShowLiveMode(false);
      setLiveDataIndex(currentDataLength);
    }
  }, [showLiveMode, currentDataLength]);

  const resetLiveMode = useCallback(() => {
    setLiveDataIndex(0);
    if (showLiveMode) {
      setShowLiveMode(false);
      setTimeout(() => setShowLiveMode(true), 100);
    }
  }, [showLiveMode]);

  const resetOnDatasetChange = useCallback(() => {
    setLiveDataIndex(0);
    setShowLiveMode(false);
  }, []);

  return {
    showLiveMode,
    liveDataIndex,
    toggleLiveMode,
    resetLiveMode,
    resetOnDatasetChange
  };
};