"use client";

import { useTeamContext } from "@/contexts/TeamContext";
import { getTeams } from "@/config";

export function TeamTabs() {
  const { currentTeamSlug, setTeam } = useTeamContext();
  const teams = getTeams();

  return (
    <div className="flex gap-1 border-b-2 border-tertiary-blue">
      {teams.map((team) => (
        <button
          key={team.slug}
          onClick={() => setTeam(team.slug)}
          className={`px-6 py-3 font-medium rounded-t-lg transition-smooth border-t-2 border-l-2 border-r-2 ${
            currentTeamSlug === team.slug
              ? "bg-bg-secondary border-primary-blue text-text-primary -mb-0.5 border-b-2 border-b-bg-secondary"
              : "bg-bg-tertiary border-tertiary-blue text-text-secondary hover:bg-bg-secondary hover:text-text-primary hover:border-secondary-blue"
          }`}
        >
          <span className="mr-2">{team.icon}</span>
          {team.name}
        </button>
      ))}
    </div>
  );
}
