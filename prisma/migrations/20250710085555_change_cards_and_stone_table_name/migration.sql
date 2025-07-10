/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stone` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_baseId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_buildEquipmentId_fkey";

-- DropForeignKey
ALTER TABLE "Stone" DROP CONSTRAINT "Stone_baseId_fkey";

-- DropForeignKey
ALTER TABLE "Stone" DROP CONSTRAINT "Stone_buildEquipmentId_fkey";

-- DropTable
DROP TABLE "Card";

-- DropTable
DROP TABLE "Stone";

-- CreateTable
CREATE TABLE "BuildCard" (
    "id" TEXT NOT NULL,
    "buildEquipmentId" TEXT,
    "baseId" TEXT NOT NULL,
    "effectsOverride" JSONB,

    CONSTRAINT "BuildCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildStone" (
    "id" TEXT NOT NULL,
    "buildEquipmentId" TEXT,
    "baseId" TEXT NOT NULL,
    "dataOverride" JSONB,

    CONSTRAINT "BuildStone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BuildCard_buildEquipmentId_idx" ON "BuildCard"("buildEquipmentId");

-- CreateIndex
CREATE INDEX "BuildStone_buildEquipmentId_idx" ON "BuildStone"("buildEquipmentId");

-- AddForeignKey
ALTER TABLE "BuildCard" ADD CONSTRAINT "BuildCard_buildEquipmentId_fkey" FOREIGN KEY ("buildEquipmentId") REFERENCES "BuildEquipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildCard" ADD CONSTRAINT "BuildCard_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "CardBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildStone" ADD CONSTRAINT "BuildStone_buildEquipmentId_fkey" FOREIGN KEY ("buildEquipmentId") REFERENCES "BuildEquipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildStone" ADD CONSTRAINT "BuildStone_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "StoneBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
