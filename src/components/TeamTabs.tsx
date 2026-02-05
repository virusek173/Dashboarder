"use client";

import { useTeamContext } from "@/contexts/TeamContext";
import { getTeams } from "@/config";

export function TeamTabs() {
  const { currentTeamSlug, setTeam } = useTeamContext();
  const teams = getTeams();

  return (
    <div className="flex gap-4">
      {teams.map((team) => (
        <button
          key={team.slug}
          onClick={() => setTeam(team.slug)}
          className={`px-4 py-2 font-medium transition-smooth relative ${
            currentTeamSlug === team.slug
              ? "text-text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <span className="mr-2">{team.icon}</span>
          {team.name}
          {currentTeamSlug === team.slug && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-blue rounded-t-sm"></div>
          )}
        </button>
      ))}
    </div>
  );
}
