'use client';

import { useEffect } from 'react';

const teamIcon = process.env.NEXT_PUBLIC_TEAM_ICON || '';

export function DynamicFavicon() {
  useEffect(() => {
    if (!teamIcon) return;

    const existingFavicon = document.querySelector("link[rel='icon']");
    if (existingFavicon) {
      existingFavicon.remove();
    }

    const link = document.createElement('link');
    link.rel = 'icon';

    if (teamIcon.startsWith('http') || teamIcon.startsWith('/')) {
      link.href = teamIcon;
    } else {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${teamIcon}</text></svg>`;
      link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    document.head.appendChild(link);
  }, []);

  return null;
}
