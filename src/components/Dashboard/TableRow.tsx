'use client';

import { RowData } from '@/types';
import { ProgressBar } from './ProgressBar';
import { getWorkingDaysColor, formatDate } from '@/lib/calculations';

interface TableRowProps {
  data: RowData;
  index: number;
}

export function TableRow({ data, index }: TableRowProps) {
  const daysColor = getWorkingDaysColor(data.workingDaysRemaining);
  const isEven = index % 2 === 0;

  return (
    <tr
      className={`transition-smooth hover:bg-bg-tertiary ${
        isEven ? 'bg-bg-secondary' : 'bg-bg-primary'
      }`}
    >
      <td className="px-4 py-3 text-text-primary font-medium">
        {data.label}
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
        {data.workingDaysRemaining}
      </td>
      <td className="px-4 py-3">
        <ProgressBar percent={data.progressPercent} />
      </td>
    </tr>
  );
}
