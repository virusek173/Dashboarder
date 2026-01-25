import { useState, useCallback } from "react";
import { RowData } from "@/types";

interface SyncResult {
  displays: RowData[];
  features: RowData[];
  timestamp: string;
}

export function useJiraData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sync all data from JIRA and save to database
   * Returns data for both tabs in one request
   */
  const syncAllData = useCallback(async (): Promise<SyncResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/jira/sync", {
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
  }, []);

  return {
    loading,
    error,
    syncAllData,
  };
}
