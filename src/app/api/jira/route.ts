import { NextRequest, NextResponse } from "next/server";
import { fetchTicketsByLabels, processRowData } from "@/lib/jira";
import { getTabConfig } from "@/config";
import { RowData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { tabId, teamSlug, release } = await request.json();

    if (!tabId || !teamSlug || !release) {
      return NextResponse.json(
        { error: "Tab ID, team slug, and release are required" },
        { status: 400 }
      );
    }

    const tabsConfig = getTabConfig(teamSlug, release);
    const tabConfig = tabsConfig.find((tab) => tab.id === tabId);

    if (!tabConfig) {
      return NextResponse.json({ error: "Invalid tab ID" }, { status: 400 });
    }

    // Get all unique labels for this tab
    const allLabels = Array.from(
      new Set(tabConfig.rows.flatMap((row) => row.jiraLabels))
    );

    // Fetch all tickets with a single query
    const allTickets = await fetchTicketsByLabels(allLabels);

    // Process data for each row
    const rowsData: RowData[] = tabConfig.rows.map((rowConfig) => {
      // Filter tickets for this row
      const rowTickets = allTickets.filter((ticket) => {
        const ticketLabels = ticket.fields.labels;

        // Check if ticket has excluded labels
        if (rowConfig.excludeLabels && rowConfig.excludeLabels.length > 0) {
          const hasExcludedLabel = ticketLabels.some((label) =>
            rowConfig.excludeLabels!.includes(label)
          );
          if (hasExcludedLabel) {
            return false; // Skip this ticket
          }
        }

        // Check if ticket matches required labels
        if (rowConfig.requireAllLabels) {
          // Must have ALL labels
          return rowConfig.jiraLabels.every((label) =>
            ticketLabels.includes(label)
          );
        } else {
          // Must have at least ONE label
          return ticketLabels.some((label) =>
            rowConfig.jiraLabels.includes(label)
          );
        }
      });

      return processRowData(rowConfig, rowTickets);
    });

    return NextResponse.json({ rows: rowsData });
  } catch (error) {
    console.error("Error fetching JIRA data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch JIRA data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST request." },
    { status: 405 }
  );
}
