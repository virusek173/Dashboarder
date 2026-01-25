import { NextResponse } from "next/server";
import { fetchTicketsByLabels, processRowData } from "@/lib/jira";
import { saveSnapshot } from "@/lib/snapshots";
import { tabsConfig } from "@/tabConfig/tabConfig";
import { RowData } from "@/types";

/**
 * POST /api/jira/sync
 * Fetches all data from JIRA and saves to database
 * Returns the complete snapshot with both tabs
 */
export async function POST() {
  try {
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

    // Save to database
    const displays = result["displays"] || [];
    const features = result["features"] || [];
    await saveSnapshot(displays, features);

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
