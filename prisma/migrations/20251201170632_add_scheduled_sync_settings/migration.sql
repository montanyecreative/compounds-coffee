-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'settings',
    "scheduledSyncEnabled" BOOLEAN NOT NULL DEFAULT false,
    "scheduledSyncTime" TEXT NOT NULL DEFAULT '13:10',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
