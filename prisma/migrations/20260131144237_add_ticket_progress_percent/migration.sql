-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SnapshotRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "snapshotId" TEXT NOT NULL,
    "tabId" TEXT NOT NULL,
    "rowId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "completedTickets" INTEGER NOT NULL,
    "totalTickets" INTEGER NOT NULL,
    "completedStoryPoints" REAL NOT NULL,
    "totalStoryPoints" REAL NOT NULL,
    "progressPercent" REAL NOT NULL,
    "ticketProgressPercent" REAL NOT NULL DEFAULT 0,
    "workingDaysRemaining" INTEGER NOT NULL,
    "deadline" DATETIME NOT NULL,
    CONSTRAINT "SnapshotRow_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SnapshotRow" ("completedStoryPoints", "completedTickets", "deadline", "id", "label", "progressPercent", "rowId", "snapshotId", "tabId", "totalStoryPoints", "totalTickets", "workingDaysRemaining") SELECT "completedStoryPoints", "completedTickets", "deadline", "id", "label", "progressPercent", "rowId", "snapshotId", "tabId", "totalStoryPoints", "totalTickets", "workingDaysRemaining" FROM "SnapshotRow";
DROP TABLE "SnapshotRow";
ALTER TABLE "new_SnapshotRow" RENAME TO "SnapshotRow";
CREATE INDEX "SnapshotRow_snapshotId_idx" ON "SnapshotRow"("snapshotId");
CREATE INDEX "SnapshotRow_tabId_rowId_idx" ON "SnapshotRow"("tabId", "rowId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
