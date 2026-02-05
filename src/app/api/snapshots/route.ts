import { NextRequest, NextResponse } from "next/server";
import { getLatestSnapshot } from "@/lib/snapshots";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering for this route (uses searchParams)
export const dynamic = 'force-dynamic';

/**
 * GET /api/snapshots?teamSlug=team1&release=R1
 * Returns the latest snapshot from database for specific team and release
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teamSlug = searchParams.get("teamSlug");
    const release = searchParams.get("release");

    if (!teamSlug || !release) {
      return NextResponse.json(
        { error: "Missing required parameters: teamSlug and release" },
        { status: 400 },
      );
    }

    // Find team by slug
    const team = await prisma.team.findUnique({
      where: { slug: teamSlug },
    });

    if (!team) {
      return NextResponse.json(
        { error: `Team "${teamSlug}" not found` },
        { status: 404 },
      );
    }

    const snapshot = await getLatestSnapshot(team.id, release);
    if (!snapshot) {
      return NextResponse.json(
        { error: "No data available. Click refresh to fetch from JIRA." },
        { status: 404 },
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
      { status: 500 },
    );
  }
}
