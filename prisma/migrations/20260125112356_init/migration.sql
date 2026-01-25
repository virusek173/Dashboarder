-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SnapshotRow" (
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
    "workingDaysRemaining" INTEGER NOT NULL,
    "deadline" DATETIME NOT NULL,
    CONSTRAINT "SnapshotRow_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_date_key" ON "Snapshot"("date");

-- CreateIndex
CREATE INDEX "SnapshotRow_snapshotId_idx" ON "SnapshotRow"("snapshotId");

-- CreateIndex
CREATE INDEX "SnapshotRow_tabId_rowId_idx" ON "SnapshotRow"("tabId", "rowId");
