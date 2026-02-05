/*
  Warnings:

  - Added the required column `release` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `Snapshot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Snapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATETIME NOT NULL,
    "teamId" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    CONSTRAINT "Snapshot_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Snapshot" ("createdAt", "date", "id") SELECT "createdAt", "date", "id" FROM "Snapshot";
DROP TABLE "Snapshot";
ALTER TABLE "new_Snapshot" RENAME TO "Snapshot";
CREATE INDEX "Snapshot_teamId_idx" ON "Snapshot"("teamId");
CREATE INDEX "Snapshot_date_idx" ON "Snapshot"("date");
CREATE INDEX "Snapshot_release_idx" ON "Snapshot"("release");
CREATE UNIQUE INDEX "Snapshot_date_teamId_release_key" ON "Snapshot"("date", "teamId", "release");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "Team"("slug");

-- CreateIndex
CREATE INDEX "Team_slug_idx" ON "Team"("slug");
