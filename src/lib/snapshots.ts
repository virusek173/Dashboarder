import { prisma } from "./prisma";
import { RowData } from "@/types";
import { getTabConfig } from "@/config";

// Database row type (matches Prisma schema)
interface DbSnapshotRow {
  id: string;
  snapshotId: string;
  tabId: string;
  rowId: string;
  label: string;
  completedTickets: number;
  totalTickets: number;
  completedStoryPoints: number;
  totalStoryPoints: number;
  progressPercent: number;
  ticketProgressPercent: number;
  workingDaysRemaining: number;
  deadline: Date;
}

/**
 * Get today's date at midnight (for snapshot uniqueness)
 * We store one snapshot per day, so we normalize to midnight
 */
function getTodayMidnight(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Get the latest snapshot from database for specific team and release
 * Returns null if no snapshots exist
 */
export async function getLatestSnapshot(teamId: string, release: string) {
  const snapshot = await prisma.snapshot.findFirst({
    where: { teamId, release },
    orderBy: { date: "desc" },
    include: { rows: true, team: true },
  });

  if (!snapshot) return null;

  // Transform database rows back to RowData format
  const rows = snapshot.rows as DbSnapshotRow[];

  const displays = rows
    .filter((row) => row.tabId === "displays")
    .map((row) => transformRowToRowData(row, "displays", snapshot.team.slug, snapshot.release));

  const features = rows
    .filter((row) => row.tabId === "features")
    .map((row) => transformRowToRowData(row, "features", snapshot.team.slug, snapshot.release));

  return {
    id: snapshot.id,
    timestamp: snapshot.createdAt.toISOString(),
    date: snapshot.date.toISOString(),
    data: { displays, features },
  };
}

/**
 * Save a new snapshot or update today's snapshot for specific team and release
 * If snapshot for today already exists, it updates it
 * Otherwise creates a new one
 */
export async function saveSnapshot(
  displays: RowData[],
  features: RowData[],
  teamId: string,
  release: string
) {
  const today = getTodayMidnight();

  // Check if today's snapshot exists for this team+release
  const existingSnapshot = await prisma.snapshot.findUnique({
    where: {
      date_teamId_release: {
        date: today,
        teamId,
        release,
      },
    },
  });

  if (existingSnapshot) {
    // Update existing: delete old rows and insert new ones
    await prisma.snapshotRow.deleteMany({
      where: { snapshotId: existingSnapshot.id },
    });

    await prisma.snapshotRow.createMany({
      data: [
        ...displays.map((row) => transformRowDataToDb(row, "displays", existingSnapshot.id)),
        ...features.map((row) => transformRowDataToDb(row, "features", existingSnapshot.id)),
      ],
    });

    // Update createdAt to reflect latest refresh
    await prisma.snapshot.update({
      where: { id: existingSnapshot.id },
      data: { createdAt: new Date() },
    });

    return existingSnapshot.id;
  } else {
    // Create new snapshot with rows
    const snapshot = await prisma.snapshot.create({
      data: {
        date: today,
        teamId,
        release,
        rows: {
          create: [
            ...displays.map((row) => transformRowDataToDbCreate(row, "displays")),
            ...features.map((row) => transformRowDataToDbCreate(row, "features")),
          ],
        },
      },
    });

    return snapshot.id;
  }
}

// Helper: Transform database row to RowData
function transformRowToRowData(row: {
  rowId: string;
  label: string;
  completedTickets: number;
  totalTickets: number;
  completedStoryPoints: number;
  totalStoryPoints: number;
  progressPercent: number;
  ticketProgressPercent: number;
  workingDaysRemaining: number;
  deadline: Date;
}, tabId: string, teamSlug: string, release: string): RowData {
  // Get config data for this row using team-specific configuration
  const tabsConfig = getTabConfig(teamSlug, release);
  const tabConfig = tabsConfig.find(tab => tab.id === tabId);
  const rowConfig = tabConfig?.rows.find(r => r.id === row.rowId);

  return {
    id: row.rowId,
    label: row.label,
    jiraLabels: rowConfig?.jiraLabels || [],
    requireAllLabels: rowConfig?.requireAllLabels,
    excludeLabels: rowConfig?.excludeLabels,
    completedTickets: row.completedTickets,
    totalTickets: row.totalTickets,
    completedStoryPoints: row.completedStoryPoints,
    totalStoryPoints: row.totalStoryPoints,
    progressPercent: row.progressPercent,
    ticketProgressPercent: row.ticketProgressPercent,
    workingDaysRemaining: row.workingDaysRemaining,
    deadline: row.deadline,
  };
}

// Helper: Transform RowData to database format (for createMany)
function transformRowDataToDb(
  row: RowData,
  tabId: string,
  snapshotId: string
) {
  return {
    snapshotId,
    tabId,
    rowId: row.id,
    label: row.label,
    completedTickets: row.completedTickets,
    totalTickets: row.totalTickets,
    completedStoryPoints: row.completedStoryPoints,
    totalStoryPoints: row.totalStoryPoints,
    progressPercent: row.progressPercent,
    ticketProgressPercent: row.ticketProgressPercent,
    workingDaysRemaining: row.workingDaysRemaining,
    deadline: row.deadline,
  };
}

// Helper: Transform RowData to database format (for create with relation)
function transformRowDataToDbCreate(row: RowData, tabId: string) {
  return {
    tabId,
    rowId: row.id,
    label: row.label,
    completedTickets: row.completedTickets,
    totalTickets: row.totalTickets,
    completedStoryPoints: row.completedStoryPoints,
    totalStoryPoints: row.totalStoryPoints,
    progressPercent: row.progressPercent,
    ticketProgressPercent: row.ticketProgressPercent,
    workingDaysRemaining: row.workingDaysRemaining,
    deadline: row.deadline,
  };
}
