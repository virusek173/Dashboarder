'use client';

import { RowData } from '@/types';
import { TableRow } from './TableRow';
import { Tooltip } from './Tooltip';
import { StoryPointsProgress } from './StoryPointsProgress';
import { COLUMN_HEADERS, COLUMN_TOOLTIPS } from '@/lib/constants';

interface StatsTableProps {
  data: RowData[];
  showSummary?: boolean;
}

export function StatsTable({ data, showSummary = true }: StatsTableProps) {
  const totalCompletedTickets = data.reduce((sum, row) => sum + row.completedTickets, 0);
  const totalAllTickets = data.reduce((sum, row) => sum + row.totalTickets, 0);
  const totalCompletedSP = data.reduce((sum, row) => sum + row.completedStoryPoints, 0);
  const totalAllSP = data.reduce((sum, row) => sum + row.totalStoryPoints, 0);
  const averageProgress = totalAllSP > 0
    ? (totalCompletedSP / totalAllSP) * 100
    : 0;

  const jiraBaseUrl = process.env.NEXT_PUBLIC_JIRA_BASE_URL;
  const allLabels = [...new Set(data.flatMap(row => row.jiraLabels))];
  const summaryJql = `labels IN (${allLabels.map(l => `"${l}"`).join(', ')})`;
  const summaryUrl = jiraBaseUrl ? `${jiraBaseUrl}/issues/?jql=${encodeURIComponent(summaryJql)}` : null;

  return (
    <div>
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full border-collapse">
        <thead>
          <tr className="bg-deep-navy border-b border-tertiary-blue">
            <th className="px-4 py-3 text-left text-text-primary font-semibold overflow-visible rounded-tl-lg">
              {COLUMN_HEADERS.label}
            </th>
            <th className="px-4 py-3 text-center text-text-primary font-semibold overflow-visible">
              <Tooltip content={COLUMN_TOOLTIPS.completedTickets}>
                <span className="cursor-help">{COLUMN_HEADERS.completedTickets}</span>
              </Tooltip>
            </th>
            <th className="px-4 py-3 text-center text-text-primary font-semibold overflow-visible">
              <Tooltip content={COLUMN_TOOLTIPS.totalTickets}>
                <span className="cursor-help">{COLUMN_HEADERS.totalTickets}</span>
              </Tooltip>
            </th>
            <th className="px-4 py-3 text-center text-text-primary font-semibold overflow-visible">
              <Tooltip content={COLUMN_TOOLTIPS.completedSP}>
                <span className="cursor-help">{COLUMN_HEADERS.completedSP}</span>
              </Tooltip>
            </th>
            <th className="px-4 py-3 text-center text-text-primary font-semibold overflow-visible">
              <Tooltip content={COLUMN_TOOLTIPS.totalSP}>
                <span className="cursor-help">{COLUMN_HEADERS.totalSP}</span>
              </Tooltip>
            </th>
            <th className="px-4 py-3 text-center text-text-primary font-semibold overflow-visible">
              <Tooltip content={COLUMN_TOOLTIPS.deadline}>
                <span className="cursor-help">{COLUMN_HEADERS.deadline}</span>
              </Tooltip>
            </th>
            <th className="px-4 py-3 text-center text-text-primary font-semibold overflow-visible">
              <Tooltip content={COLUMN_TOOLTIPS.workingDays}>
                <span className="cursor-help">{COLUMN_HEADERS.workingDays}</span>
              </Tooltip>
            </th>
            <th className="px-4 py-3 text-center text-text-primary font-semibold overflow-visible rounded-tr-lg">
              <Tooltip content={COLUMN_TOOLTIPS.progress}>
                <span className="cursor-help">{COLUMN_HEADERS.progress}</span>
              </Tooltip>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-8 text-center text-text-muted"
              >
                No data to display
              </td>
            </tr>
          ) : (
            <>
              {data.map((row, index) => (
                <TableRow
                  key={row.id}
                  data={row}
                  index={index}
                  isLastRow={!showSummary && index === data.length - 1}
                />
              ))}
              {showSummary && (
                <tr className="bg-deep-navy border-y-2 border-tertiary font-semibold">
                  <td className="px-4 py-3 text-left text-text-primary">
                    {summaryUrl ? (
                      <a
                        href={summaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent-blue hover:underline transition-smooth"
                      >
                        Summary
                      </a>
                    ) : (
                      'Summary'
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-text-primary">
                    {totalCompletedTickets}
                  </td>
                  <td className="px-4 py-3 text-center text-text-primary">
                    {totalAllTickets}
                  </td>
                  <td className="px-4 py-3 text-center text-text-primary">
                    {totalCompletedSP}
                  </td>
                  <td className="px-4 py-3 text-center text-text-primary">
                    {totalAllSP}
                  </td>
                  <td className="px-4 py-3 text-center text-text-muted">
                    -
                  </td>
                  <td className="px-4 py-3 text-center text-text-muted">
                    -
                  </td>
                  <td className="px-4 py-3 text-center text-text-primary">
                    {averageProgress.toFixed(1)}%
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
      </div>

      {data.length > 0 && showSummary && (
        <StoryPointsProgress
          completedSP={totalCompletedSP}
          totalSP={totalAllSP}
        />
      )}
    </div>
  );
}
