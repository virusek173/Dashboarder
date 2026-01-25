'use client';

import { useState, useEffect } from 'react';
import { TabType, RowData } from '@/types';
import { TabNavigation } from './TabNavigation';
import { StatsTable } from './StatsTable';
import { RefreshButton } from './RefreshButton';
import { useJiraData } from '@/hooks/useJiraData';
import { useCachedData } from '@/hooks/useCachedData';
import { formatTimestamp } from '@/lib/calculations';
import { tabsConfig } from '@/data/tabConfig';

const teamName = process.env.NEXT_PUBLIC_TEAM_NAME || '';
const releaseNumber = process.env.NEXT_PUBLIC_RELEASE_NUMBER || '';
const teamIcon = process.env.NEXT_PUBLIC_TEAM_ICON || '';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('displays');
  const [displaysData, setDisplaysData] = useState<RowData[]>([]);
  const [featuresData, setFeaturesData] = useState<RowData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const { loading, error, fetchTabData } = useJiraData();
  const { cachedData, saveToCache } = useCachedData();

  useEffect(() => {
    if (cachedData) {
      setDisplaysData(cachedData.data.displays);
      setFeaturesData(cachedData.data.features);
      setLastUpdate(cachedData.timestamp);
    }
  }, [cachedData]);

  const handleRefresh = async () => {
    try {
      const displaysResult = await fetchTabData('displays');
      const featuresResult = await fetchTabData('features');

      setDisplaysData(displaysResult);
      setFeaturesData(featuresResult);

      const now = new Date().toISOString();
      setLastUpdate(now);

      saveToCache(displaysResult, featuresResult);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  };

  const currentData = activeTab === 'displays' ? displaysData : featuresData;
  const currentTabConfig = tabsConfig.find(tab => tab.id === activeTab);
  const showSummary = currentTabConfig?.showSummary ?? true;

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
            {teamIcon && <span>{teamIcon}</span>}
            {teamName} TEAM RELEASE {releaseNumber} PROGRESS DASHBOARD
          </h1>
          <div className="flex items-center gap-4">
            {lastUpdate && (
              <div className="text-sm text-text-secondary">
                Data from: {formatTimestamp(lastUpdate)}
              </div>
            )}
            <RefreshButton onClick={handleRefresh} loading={loading} />
          </div>
        </div>

        <div className="mb-6">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-status-danger bg-opacity-10 border border-status-danger rounded-lg text-status-danger">
            <p className="font-medium">Error fetching data:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading && !currentData.length ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-text-secondary">Loading data...</div>
          </div>
        ) : (
          <div className="bg-bg-secondary border-2 border-tertiary-blue rounded-lg overflow-visible">
            <StatsTable data={currentData} showSummary={showSummary} />
          </div>
        )}
      </div>
    </div>
  );
}
