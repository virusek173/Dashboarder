"use client";

import { useState, useEffect } from "react";
import { TabType, RowData, ProgressMode } from "@/types";
import { TabNavigation } from "./TabNavigation";
import { StatsTable } from "./StatsTable";
import { RefreshButton } from "./RefreshButton";
import { ProgressModeSwitch } from "./ProgressModeSwitch";
import { useJiraData } from "@/hooks/useJiraData";
import { useCachedData } from "@/hooks/useCachedData";
import { formatTimestamp } from "@/lib/calculations";
import { PROGRESS_MODE } from "@/lib/constants";
import { TeamProvider, useTeamContext } from "@/contexts/TeamContext";
import { TeamTabs } from "@/components/TeamTabs";
import { ReleaseSelector } from "@/components/ReleaseSelector";
import { getTabConfig } from "@/config";

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "PROJECT";

function DashboardContent() {
  const { currentTeamSlug, currentRelease } = useTeamContext();
  const [activeTab, setActiveTab] = useState<TabType>("displays");
  const [displaysData, setDisplaysData] = useState<RowData[]>([]);
  const [featuresData, setFeaturesData] = useState<RowData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [progressMode, setProgressMode] = useState<ProgressMode>(PROGRESS_MODE.STORY_POINTS);

  const { loading: syncing, error, syncAllData } = useJiraData(currentTeamSlug, currentRelease);
  const { cachedData, loading: initialLoading } = useCachedData(currentTeamSlug, currentRelease);

  const tabsConfig = getTabConfig(currentTeamSlug, currentRelease) || [];

  // Load data from database on mount
  useEffect(() => {
    if (cachedData) {
      setDisplaysData(cachedData.data.displays);
      setFeaturesData(cachedData.data.features);
      setLastUpdate(cachedData.timestamp);
    }
  }, [cachedData]);

  // Refresh: fetch from JIRA and save to database
  const handleRefresh = async () => {
    try {
      const result = await syncAllData();
      setDisplaysData(result.displays);
      setFeaturesData(result.features);
      setLastUpdate(result.timestamp);
    } catch (err) {
      console.error("Failed to refresh data:", err);
    }
  };

  const currentData = activeTab === 'displays' ? displaysData : featuresData;
  const currentTabConfig = tabsConfig?.find(tab => tab.id === activeTab);
  const showSummary = currentTabConfig?.showSummary ?? true;

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-6 text-center">
          {projectName} PROGRESS DASHBOARD
        </h1>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <TeamTabs />
            <div className="flex items-center gap-4">
              <ReleaseSelector />
              <RefreshButton onClick={handleRefresh} loading={syncing} />
            </div>
          </div>
        </div>

        {lastUpdate && (
          <div className="flex items-center justify-end mb-8">
            <div className="text-sm text-text-secondary">
              Data from: {formatTimestamp(lastUpdate)}
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <ProgressModeSwitch mode={progressMode} onChange={setProgressMode} />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-status-danger bg-opacity-10 border border-status-danger rounded-lg text-status-danger">
            <p className="font-medium">Error fetching data:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {(syncing || initialLoading) && !currentData.length ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-text-secondary">Loading data...</div>
          </div>
        ) : (
          <div className="bg-bg-secondary border-2 border-tertiary-blue rounded-lg overflow-visible">
            <StatsTable data={currentData} showSummary={showSummary} progressMode={progressMode} />
          </div>
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <TeamProvider>
      <DashboardContent />
    </TeamProvider>
  );
}
