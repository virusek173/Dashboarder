"use client";

import { useTeamContext } from "@/contexts/TeamContext";

export function ReleaseSelector() {
  const { currentRelease, availableReleases, setRelease } = useTeamContext();

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="release-select" className="text-sm font-medium text-text-secondary">
        Release:
      </label>
      <select
        id="release-select"
        value={currentRelease}
        onChange={(e) => setRelease(e.target.value)}
        className="px-4 py-2 bg-bg-secondary border border-tertiary-blue rounded-md text-sm font-medium text-text-primary cursor-pointer hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-primary-blue transition-smooth"
      >
        {availableReleases.map((release) => (
          <option key={release} value={release} className="bg-bg-tertiary text-text-primary">
            {release}
          </option>
        ))}
      </select>
    </div>
  );
}
