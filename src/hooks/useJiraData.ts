import { useState, useCallback } from 'react';
import { RowData, TabType } from '@/types';

export function useJiraData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTabData = useCallback(async (tabId: TabType): Promise<RowData[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/jira', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tabId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const data = await response.json();
      return data.rows;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchTabData,
  };
}
