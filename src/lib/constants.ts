export const CACHE_KEY = 'jira-dashboard-cache';

export const COLUMN_HEADERS = {
  label: 'Label',
  completedTickets: '✓ Tickets',
  totalTickets: 'Σ Tickets',
  completedSP: '✓ SP',
  totalSP: 'Σ SP',
  deadline: 'Deadline',
  workingDays: 'Days',
  progress: 'Progress',
} as const;

export const COLUMN_TOOLTIPS = {
  completedTickets: 'Number of completed tickets',
  totalTickets: 'Total number of tickets',
  completedSP: 'Story Points of completed tickets',
  totalSP: 'Total Story Points',
  deadline: 'Declared completion date',
  workingDays: 'Working days remaining until deadline',
  progress: 'Completion percentage (tickets)',
} as const;
