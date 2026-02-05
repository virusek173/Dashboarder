"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TeamContextType {
  currentTeamSlug: string;
  currentRelease: string;
  availableReleases: string[];
  setTeam: (slug: string) => void;
  setRelease: (release: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);


interface TeamProviderProps {
  children: ReactNode;
}

export function TeamProvider({ children }: TeamProviderProps) {
  const [currentTeamSlug, setCurrentTeamSlug] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_TEAM_SLUG || "team1"
  );
  const [currentRelease, setCurrentRelease] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_RELEASE || "R1"
  );

  // For now, hardcoded releases - can be fetched from API later
  const availableReleases = ["R1"];

  const setTeam = (slug: string) => {
    setCurrentTeamSlug(slug);
  };

  const setRelease = (release: string) => {
    setCurrentRelease(release);
  };

  return (
    <TeamContext.Provider
      value={{
        currentTeamSlug,
        currentRelease,
        availableReleases,
        setTeam,
        setRelease,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeamContext() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeamContext must be used within a TeamProvider");
  }
  return context;
}
