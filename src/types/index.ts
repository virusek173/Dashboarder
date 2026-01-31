export interface JiraTicket {
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    resolution: {
      name: string;
    } | null;
    labels: string[];
    [key: string]: any; // Allow dynamic custom fields like customfield
  };
}

export interface RowData {
  id: string;
  label: string;
  jiraLabels: string[];
  requireAllLabels?: boolean;
  excludeLabels?: string[];
  completedTickets: number;
  totalTickets: number;
  completedStoryPoints: number;
  totalStoryPoints: number;
  deadline: Date;
  workingDaysRemaining: number;
  progressPercent: number;
  ticketProgressPercent: number;
}

export interface CachedData {
  timestamp: string;
  data: {
    displays: RowData[];
    features: RowData[];
  };
}

export interface TabConfig {
  id: string;
  label: string;
  rows: RowConfig[];
  showSummary?: boolean;
}

export interface RowConfig {
  id: string;
  label: string;
  jiraLabels: string[];
  requireAllLabels?: boolean; // If true, ticket must have ALL labels
  excludeLabels?: string[]; // Ticket must NOT have any of these labels
  deadline: string; // YYYY-MM-DD format
}

export type TabType = 'displays' | 'features';

export type ProgressMode = 'story-points' | 'tickets';
