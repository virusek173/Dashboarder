import type { Metadata } from 'next';
import './globals.css';
import { DynamicFavicon } from '@/components/DynamicFavicon';

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || 'PROJECT';

export const metadata: Metadata = {
  title: `${projectName} Progress Dashboard`,
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
