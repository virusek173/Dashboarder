import { PrismaClient } from "../src/generated/prisma/client";
import teamsConfig from "../src/config/teams.json";

const prisma = new PrismaClient();
const DEFAULT_TEAM_SLUG = process.env.DEFAULT_TEAM_SLUG;
const DEFAULT_RELEASE = process.env.DEFAULT_RELEASE;

async function main() {
  console.log("Seeding teams...");

  // Upsert teams from config
  for (const team of teamsConfig) {
    await prisma.team.upsert({
      where: { slug: team.slug },
      update: { name: team.name, icon: team.icon },
      create: { slug: team.slug, name: team.name, icon: team.icon },
    });
    console.log(`  Team "${team.name}" (${team.slug}) created/updated`);
  }

  // Migrate existing snapshots to default team if they don't have teamId
  const defaultTeam = await prisma.team.findUnique({
    where: { slug: DEFAULT_TEAM_SLUG },
  });

  if (defaultTeam) {
    // Check if there are snapshots without teamId (shouldn't happen after migration, but just in case)
    const snapshotsWithoutTeam = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*) as count FROM Snapshot WHERE teamId IS NULL OR teamId = ''
    `;

    if (snapshotsWithoutTeam[0]?.count > 0) {
      console.log(
        `Migrating ${snapshotsWithoutTeam[0].count} snapshots to default team...`,
      );
      await prisma.$executeRaw`
        UPDATE Snapshot SET teamId = ${defaultTeam.id}, release = ${DEFAULT_RELEASE} WHERE teamId IS NULL OR teamId = ''
      `;
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
