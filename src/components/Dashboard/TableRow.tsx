'use client';

import { RowData } from '@/types';
import { ProgressBar } from './ProgressBar';
import { getWorkingDaysColor, formatDate, calculateWorkingDays } from '@/lib/calculations';

function buildJiraUrl(baseUrl: string | undefined, data: RowData): string | null {
  if (!baseUrl) return null;
  if (!data.jiraLabels || data.jiraLabels.length === 0) return null;

  const conditions: string[] = [];

  if (data.requireAllLabels) {
    data.jiraLabels.forEach(label => {
      conditions.push(`labels = "${label}"`);
    });
  } else {
    const labels = data.jiraLabels.map(l => `"${l}"`).join(', ');
    conditions.push(`labels IN (${labels})`);
  }

  if (data.excludeLabels?.length) {
    const excludeLabels = data.excludeLabels.map(l => `"${l}"`).join(', ');
    conditions.push(`labels NOT IN (${excludeLabels})`);
  }

  const jql = conditions.join(' AND ');
  return `${baseUrl}/issues/?jql=${encodeURIComponent(jql)}`;
}

interface TableRowProps {
  data: RowData;
  index: number;
  isLastRow?: boolean;
}

export function TableRow({ data, index, isLastRow = false }: TableRowProps) {
  const workingDaysRemaining = Math.max(0, calculateWorkingDays(data.deadline));
  const daysColor = getWorkingDaysColor(workingDaysRemaining);
  const isEven = index % 2 === 0;

  const jiraBaseUrl = process.env.NEXT_PUBLIC_JIRA_BASE_URL;
  const jiraUrl = buildJiraUrl(jiraBaseUrl, data);

  return (
    <tr
      className={`transition-smooth hover:bg-bg-tertiary ${
        isEven ? 'bg-bg-secondary' : 'bg-bg-primary'
      }`}
    >
      <td className={`px-4 py-3 text-text-primary font-medium ${isLastRow ? 'rounded-bl-lg' : ''}`}>
        {jiraUrl ? (
          <a
            href={jiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-blue hover:underline transition-smooth"
          >
            {data.label}
          </a>
        ) : (
          data.label
        )}
      </td>
      <td className="px-4 py-3 text-center text-text-secondary">
        {data.completedTickets}
      </td>
      <td className="px-4 py-3 text-center text-text-secondary">
        {data.totalTickets}
      </td>
      <td className="px-4 py-3 text-center text-text-secondary">
        {data.completedStoryPoints}
      </td>
      <td className="px-4 py-3 text-center text-text-secondary">
        {data.totalStoryPoints}
      </td>
      <td className="px-4 py-3 text-center text-text-secondary">
        {formatDate(data.deadline)}
      </td>
      <td className={`px-4 py-3 text-center font-medium ${daysColor}`}>
        {workingDaysRemaining}
      </td>
      <td className={`px-4 py-3 ${isLastRow ? 'rounded-br-lg' : ''}`}>
        <ProgressBar percent={data.progressPercent} />
      </td>
    </tr>
  );
}
