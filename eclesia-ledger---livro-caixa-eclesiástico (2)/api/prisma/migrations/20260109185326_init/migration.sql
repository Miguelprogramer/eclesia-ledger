-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "serviceType" TEXT NOT NULL,
    "deaconName" TEXT NOT NULL,
    "attendance" INTEGER NOT NULL,
    "visitors" INTEGER NOT NULL,
    "tithes" REAL NOT NULL DEFAULT 0,
    "offeringsPix" REAL NOT NULL DEFAULT 0,
    "offeringsCash" REAL NOT NULL DEFAULT 0,
    "offerings" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "timestamp" BIGINT NOT NULL,
    "titheEntries" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "churchName" TEXT NOT NULL,
    "monthlyGoal" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
