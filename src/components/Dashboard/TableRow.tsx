'use client';

import { RowData } from '@/types';
import { ProgressBar } from './ProgressBar';
import { getWorkingDaysColor, formatDate, calculateWorkingDays } from '@/lib/calculations';

interface TableRowProps {
  data: RowData;
  index: number;
}

export function TableRow({ data, index }: TableRowProps) {
  const workingDaysRemaining = Math.max(0, calculateWorkingDays(data.deadline));
  const daysColor = getWorkingDaysColor(workingDaysRemaining);
  const isEven = index % 2 === 0;

  const jiraBaseUrl = process.env.NEXT_PUBLIC_JIRA_BASE_URL;
  const includeJql = data.requireAllLabels
    ? data.jiraLabels.map(l => `labels = "${l}"`).join(' AND ')
    : `labels IN (${data.jiraLabels.map(l => `"${l}"`).join(', ')})`;
  const excludeJql = data.excludeLabels?.length
    ? ` AND labels NOT IN (${data.excludeLabels.map(l => `"${l}"`).join(', ')})`
    : '';
  const jql = includeJql + excludeJql;
  const jiraUrl = jiraBaseUrl ? `${jiraBaseUrl}/issues/?jql=${encodeURIComponent(jql)}` : null;

  return (
    <tr
      className={`transition-smooth hover:bg-bg-tertiary ${
        isEven ? 'bg-bg-secondary' : 'bg-bg-primary'
      }`}
    >
      <td className="px-4 py-3 text-text-primary font-medium">
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
      <td className="px-4 py-3">
        <ProgressBar percent={data.progressPercent} />
      </td>
    </tr>
  );
}
