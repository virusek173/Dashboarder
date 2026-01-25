import { useState, useEffect } from "react";
import { CachedData } from "@/types";

/**
 * Hook for loading cached data from database via API
 */
export function useCachedData() {
  const [cachedData, setCachedData] = useState<CachedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromDatabase();
  }, []);

  const loadFromDatabase = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/snapshots");

      if (response.ok) {
        const data = await response.json();
        setCachedData({
          timestamp: data.timestamp,
          data: data.data,
        });
      } else if (response.status === 404) {
        // No data yet, that's fine
        setCachedData(null);
      }
    } catch (error) {
      console.error("Error loading from database:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    cachedData,
    loading,
    refetch: loadFromDatabase,
  };
}
