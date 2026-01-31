import { SocksProxyAgent } from "socks-proxy-agent";
import axios, { AxiosInstance } from "axios";
import { JiraTicket, RowData, RowConfig } from "@/types";
import { calculateWorkingDays, calculateProgress } from "./calculations";

const JIRA_BASE_URL = process.env.NEXT_PUBLIC_JIRA_BASE_URL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const SOCKS_PROXY_URL = process.env.SOCKS_PROXY_URL;
const STORY_POINTS_FIELD = process.env.JIRA_STORY_POINTS_FIELD;
const RESOLVED_STATUS = process.env.JIRA_RESOLVED_STATUS;

let jiraClient: AxiosInstance | null = null;

/**
 * Initializes JIRA client with optional SOCKS proxy
 */
function getJiraClient(): AxiosInstance {
  if (jiraClient) return jiraClient;

  if (SOCKS_PROXY_URL) {
    const agent = new SocksProxyAgent(SOCKS_PROXY_URL);

    jiraClient = axios.create({
      httpsAgent: agent,
      httpAgent: agent,
      timeout: 30000,
    });
  } else {
    jiraClient = axios.create({
      timeout: 30000,
    });
  }

  return jiraClient;
}

/**
 * Fetches tickets for multiple labels
 */
export async function fetchTicketsByLabels(
  labels: string[],
): Promise<JiraTicket[]> {
  if (labels.length === 0) return [];

  if (!JIRA_BASE_URL || !JIRA_API_TOKEN) {
    throw new Error(
      "JIRA_BASE_URL or JIRA_API_TOKEN is not defined in environment variables",
    );
  }

  const client = getJiraClient();

  // Build JQL query for multiple labels: labels IN (label1, label2, label3)
  const labelsQuery = labels.map((l) => `"${l}"`).join(", ");
  const jql = `labels IN (${labelsQuery})`;

  const response = await client.get(
    `${JIRA_BASE_URL}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=1000`,
    {
      headers: {
        Authorization: `Bearer ${JIRA_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data.issues || [];
}

/**
 * Checks if ticket is completed
 */
export function isTicketCompleted(ticket: JiraTicket): boolean {
  return (
    ticket.fields.resolution !== null &&
    ticket.fields.resolution.name === RESOLVED_STATUS
  );
}

/**
 * Processes tickets and calculates statistics for a given row
 */
export function processRowData(
  rowConfig: RowConfig,
  tickets: JiraTicket[],
): RowData {
  const deadline = new Date(rowConfig.deadline);

  const completedTickets = tickets.filter(isTicketCompleted);
  const totalTickets = tickets;

  const completedStoryPoints = completedTickets.reduce((sum, ticket) => {
    return (
      sum +
      ((ticket.fields[
        STORY_POINTS_FIELD as keyof typeof ticket.fields
      ] as number) || 0)
    );
  }, 0);

  const totalStoryPoints = totalTickets.reduce((sum, ticket) => {
    return (
      sum +
      ((ticket.fields[
        STORY_POINTS_FIELD as keyof typeof ticket.fields
      ] as number) || 0)
    );
  }, 0);

  const workingDaysRemaining = calculateWorkingDays(deadline);
  const progressPercent = calculateProgress(
    completedStoryPoints,
    totalStoryPoints,
  );
  const ticketProgressPercent = calculateProgress(
    completedTickets.length,
    totalTickets.length,
  );

  return {
    id: rowConfig.id,
    label: rowConfig.label,
    jiraLabels: rowConfig.jiraLabels,
    requireAllLabels: rowConfig.requireAllLabels,
    excludeLabels: rowConfig.excludeLabels,
    completedTickets: completedTickets.length,
    totalTickets: totalTickets.length,
    completedStoryPoints,
    totalStoryPoints,
    deadline,
    workingDaysRemaining,
    progressPercent,
    ticketProgressPercent,
  };
}
