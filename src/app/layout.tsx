import type { Metadata } from 'next';
import './globals.css';
import { DynamicFavicon } from '@/components/DynamicFavicon';

const teamName = process.env.NEXT_PUBLIC_TEAM_NAME || 'Team';
const capitalizedTeamName = teamName.charAt(0).toUpperCase() + teamName.slice(1).toLowerCase();

export const metadata: Metadata = {
  title: `${capitalizedTeamName} Progress Dashboard`,
  description: 'Dashboard for tracking development team progress with JIRA integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <DynamicFavicon />
        {children}
      </body>
    </html>
  );
}
