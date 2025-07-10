/*
  Warnings:

  - A unique constraint covering the columns `[buildEquipmentId]` on the table `BuildStone` will be added. If there are existing duplicate values, this will fail.
  - Made the column `buildEquipmentId` on table `BuildStone` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BuildStone" DROP CONSTRAINT "BuildStone_buildEquipmentId_fkey";

-- AlterTable
ALTER TABLE "BuildStone" ALTER COLUMN "buildEquipmentId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BuildStone_buildEquipmentId_key" ON "BuildStone"("buildEquipmentId");

-- AddForeignKey
ALTER TABLE "BuildStone" ADD CONSTRAINT "BuildStone_buildEquipmentId_fkey" FOREIGN KEY ("buildEquipmentId") REFERENCES "BuildEquipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
