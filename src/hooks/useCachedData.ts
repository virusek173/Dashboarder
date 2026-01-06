import { useState, useEffect } from 'react';
import { CachedData, RowData } from '@/types';
import { CACHE_KEY } from '@/lib/constants';

export function useCachedData() {
  const [cachedData, setCachedData] = useState<CachedData | null>(null);

  useEffect(() => {
    loadFromCache();
  }, []);

  const loadFromCache = () => {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed: CachedData = JSON.parse(stored);
        setCachedData(parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
    }
    return null;
  };

  const saveToCache = (displays: RowData[], features: RowData[]) => {
    try {
      const dataToCache: CachedData = {
        timestamp: new Date().toISOString(),
        data: {
          displays,
          features,
        },
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
      setCachedData(dataToCache);
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      setCachedData(null);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return {
    cachedData,
    saveToCache,
    clearCache,
    loadFromCache,
  };
}
