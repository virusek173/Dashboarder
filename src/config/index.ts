import { TabConfig } from "@/types";
import teamsData from "./teams.json";
import tabConfigsData from "./tabs.json";

// Team configuration interface
export interface TeamConfig {
  slug: string;
  name: string;
  icon?: string;
}

/**
 * Get all teams
 * @returns Array of team configurations
 */
export function getTeams(): TeamConfig[] {
  return teamsData as TeamConfig[];
}

/**
 * Get team by slug
 * @param slug - Team slug
 * @returns Team configuration or undefined
 */
export function getTeam(slug: string): TeamConfig | undefined {
  const teams = teamsData as TeamConfig[];
  return teams.find(team => team.slug === slug);
}

/**
 * Get tab configuration for specific team and release
 * @param teamSlug - Team slug (e.g., "team1", "team2")
 * @param release - Release name (e.g., "R1")
 * @returns Tab configuration array
 */
export function getTabConfig(teamSlug: string, release: string): TabConfig[] {
  const key = `${teamSlug.toLowerCase()}-${release.toLowerCase()}`;

  const configs = tabConfigsData as Record<string, TabConfig[]>;
  const config = configs[key];

  if (!config) {
    console.warn(
      `No configuration found for team "${teamSlug}" and release "${release}". Using first available config.`
    );
    // Return first available config as fallback
    const firstKey = Object.keys(configs)[0];
    return configs[firstKey] || [];
  }

  return config;
}
