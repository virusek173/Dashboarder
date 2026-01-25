import { NextResponse } from "next/server";
import { getLatestSnapshot } from "@/lib/snapshots";

/**
 * GET /api/snapshots
 * Returns the latest snapshot from database
 */
export async function GET() {
  try {
    const snapshot = await getLatestSnapshot();

    if (!snapshot) {
      return NextResponse.json(
        { error: "No data available. Click refresh to fetch from JIRA." },
        { status: 404 }
      );
    }

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("Error fetching snapshot:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch snapshot",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
