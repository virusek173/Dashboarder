import { NextRequest, NextResponse } from "next/server";
import { fetchTicketsByLabels, processRowData } from "@/lib/jira";
import { saveSnapshot } from "@/lib/snapshots";
import { getTabConfig } from "@/config";
import { RowData } from "@/types";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering for this route (uses searchParams)
export const dynamic = 'force-dynamic';

/**
 * POST /api/jira/sync?teamSlug=team1&release=R1
 * Fetches all data from JIRA and saves to database for specific team and release
 * Returns the complete snapshot with both tabs
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teamSlug = searchParams.get("teamSlug");
    const release = searchParams.get("release");

    if (!teamSlug || !release) {
      return NextResponse.json(
        { error: "Missing required parameters: teamSlug and release" },
        { status: 400 }
      );
    }

    // Find team by slug
    const team = await prisma.team.findUnique({
      where: { slug: teamSlug },
    });

    if (!team) {
      return NextResponse.json(
        { error: `Team "${teamSlug}" not found` },
        { status: 404 }
      );
    }

    // Load configuration for this team+release
    const tabsConfig = getTabConfig(teamSlug, release);

    // Get all unique labels from all tabs
    const allLabels = Array.from(
      new Set(tabsConfig.flatMap((tab) => tab.rows.flatMap((row) => row.jiraLabels)))
    );

    // Fetch all tickets in one request
    const allTickets = await fetchTicketsByLabels(allLabels);
    // Process data for each tab
    const result: Record<string, RowData[]> = {};

    for (const tabConfig of tabsConfig) {
      const rowsData: RowData[] = tabConfig.rows.map((rowConfig) => {
        const rowTickets = allTickets.filter((ticket) => {
          const ticketLabels = ticket.fields.labels;

          // Check excluded labels
          if (rowConfig.excludeLabels && rowConfig.excludeLabels.length > 0) {
            const hasExcludedLabel = ticketLabels.some((label) =>
              rowConfig.excludeLabels!.includes(label)
            );
            if (hasExcludedLabel) return false;
          }

          // Check required labels
          if (rowConfig.requireAllLabels) {
            return rowConfig.jiraLabels.every((label) => ticketLabels.includes(label));
          } else {
            return ticketLabels.some((label) => rowConfig.jiraLabels.includes(label));
          }
        });

        return processRowData(rowConfig, rowTickets);
      });

      result[tabConfig.id] = rowsData;
    }

    // Save to database with team and release
    const displays = result["displays"] || [];
    const features = result["features"] || [];
    await saveSnapshot(displays, features, team.id, release);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      data: { displays, features },
    });
  } catch (error) {
    console.error("Error syncing JIRA data:", error);
    return NextResponse.json(
      {
        error: "Failed to sync JIRA data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
