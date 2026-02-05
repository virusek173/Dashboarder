import { useState, useCallback } from "react";
import { RowData } from "@/types";

interface SyncResult {
  displays: RowData[];
  features: RowData[];
  timestamp: string;
}

export function useJiraData(teamSlug: string, release: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sync all data from JIRA and save to database for specific team and release
   * Returns data for both tabs in one request
   */
  const syncAllData = useCallback(async (): Promise<SyncResult> => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ teamSlug, release });
      const response = await fetch(`/api/jira/sync?${params}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to sync data");
      }

      const data = await response.json();
      return {
        displays: data.data.displays,
        features: data.data.features,
        timestamp: data.timestamp,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [teamSlug, release]);

  return {
    loading,
    error,
    syncAllData,
  };
}
