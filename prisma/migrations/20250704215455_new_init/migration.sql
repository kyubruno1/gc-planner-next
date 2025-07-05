/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Build` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Build` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Build` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Build` table. All the data in the column will be lost.
  - The `type` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `jobs` on the `Character` table. All the data in the column will be lost.
  - You are about to alter the column `hp_rec` on the `Equipment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `level` on the `Stone` table. All the data in the column will be lost.
  - You are about to drop the column `specialEffect` on the `Stone` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Stone` table. All the data in the column will be lost.
  - You are about to drop the `StoneData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[statusId]` on the table `Build` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jobKey` to the `Build` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sheetName` to the `Build` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Build` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAttack` to the `Build` table without a default value. This is not possible if the table is not empty.
  - Made the column `characterId` on table `Build` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_attack` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `attack` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `crit_chance` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `crit_damage` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sp_attack` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mp_rec` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hell_spear_chance` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hell_spear` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taint_resistance` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `defense` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hp` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `crit_resistance` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sp_def` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hp_rec` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `counter_attack_resistance` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exp` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gp` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `data` to the `Stone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stoneType` to the `Stone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Build" DROP CONSTRAINT "Build_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Build" DROP CONSTRAINT "Build_userId_fkey";

-- DropIndex
DROP INDEX "Character_name_key";

-- AlterTable
ALTER TABLE "Build" DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "jobKey" TEXT NOT NULL,
ADD COLUMN     "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sheetName" TEXT NOT NULL,
ADD COLUMN     "statusId" TEXT NOT NULL,
ADD COLUMN     "totalAttack" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "characterId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "type",
ADD COLUMN     "type" TEXT[];

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "jobs";

-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "propsOverride" JSONB,
ALTER COLUMN "bonusType" DROP NOT NULL,
ALTER COLUMN "total_attack" SET NOT NULL,
ALTER COLUMN "total_attack" DROP DEFAULT,
ALTER COLUMN "attack" SET NOT NULL,
ALTER COLUMN "attack" DROP DEFAULT,
ALTER COLUMN "crit_chance" SET NOT NULL,
ALTER COLUMN "crit_chance" DROP DEFAULT,
ALTER COLUMN "crit_damage" SET NOT NULL,
ALTER COLUMN "crit_damage" DROP DEFAULT,
ALTER COLUMN "sp_attack" SET NOT NULL,
ALTER COLUMN "sp_attack" DROP DEFAULT,
ALTER COLUMN "mp_rec" SET NOT NULL,
ALTER COLUMN "mp_rec" DROP DEFAULT,
ALTER COLUMN "hell_spear_chance" SET NOT NULL,
ALTER COLUMN "hell_spear_chance" DROP DEFAULT,
ALTER COLUMN "hell_spear" SET NOT NULL,
ALTER COLUMN "hell_spear" DROP DEFAULT,
ALTER COLUMN "taint_resistance" SET NOT NULL,
ALTER COLUMN "taint_resistance" DROP DEFAULT,
ALTER COLUMN "defense" SET NOT NULL,
ALTER COLUMN "defense" DROP DEFAULT,
ALTER COLUMN "hp" SET NOT NULL,
ALTER COLUMN "hp" DROP DEFAULT,
ALTER COLUMN "crit_resistance" SET NOT NULL,
ALTER COLUMN "crit_resistance" DROP DEFAULT,
ALTER COLUMN "sp_def" SET NOT NULL,
ALTER COLUMN "sp_def" DROP DEFAULT,
ALTER COLUMN "hp_rec" SET NOT NULL,
ALTER COLUMN "hp_rec" DROP DEFAULT,
ALTER COLUMN "hp_rec" SET DATA TYPE INTEGER,
ALTER COLUMN "counter_attack_resistance" SET NOT NULL,
ALTER COLUMN "counter_attack_resistance" DROP DEFAULT,
ALTER COLUMN "exp" SET NOT NULL,
ALTER COLUMN "exp" DROP DEFAULT,
ALTER COLUMN "gp" SET NOT NULL,
ALTER COLUMN "gp" DROP DEFAULT,
ALTER COLUMN "props" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Stone" DROP COLUMN "level",
DROP COLUMN "specialEffect",
DROP COLUMN "type",
ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "stoneType" TEXT NOT NULL;

-- DropTable
DROP TABLE "StoneData";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "JobStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildStatus" (
    "id" TEXT NOT NULL,
    "buildId" TEXT,
    "total_attack" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "crit_chance" DOUBLE PRECISION NOT NULL,
    "crit_damage" DOUBLE PRECISION NOT NULL,
    "sp_attack" INTEGER NOT NULL,
    "mp_rec" DOUBLE PRECISION NOT NULL,
    "hell_spear_chance" DOUBLE PRECISION NOT NULL,
    "hell_spear" DOUBLE PRECISION NOT NULL,
    "taint_resistance" DOUBLE PRECISION NOT NULL,
    "defense" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "crit_resistance" DOUBLE PRECISION NOT NULL,
    "sp_def" INTEGER NOT NULL,
    "hp_rec" INTEGER NOT NULL,
    "counter_attack_resistance" DOUBLE PRECISION NOT NULL,
    "exp" INTEGER NOT NULL,
    "gp" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BuildStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CombinedSet" (
    "id" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "setKey" TEXT NOT NULL,

    CONSTRAINT "CombinedSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CombinedSetEffect" (
    "id" TEXT NOT NULL,
    "combinedSetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CombinedSetEffect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Job_characterId_idx" ON "Job"("characterId");

-- CreateIndex
CREATE INDEX "JobStatus_jobId_idx" ON "JobStatus"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildStatus_buildId_key" ON "BuildStatus"("buildId");

-- CreateIndex
CREATE INDEX "CombinedSet_buildId_idx" ON "CombinedSet"("buildId");

-- CreateIndex
CREATE UNIQUE INDEX "Build_statusId_key" ON "Build"("statusId");

-- CreateIndex
CREATE INDEX "Build_characterId_idx" ON "Build"("characterId");

-- CreateIndex
CREATE INDEX "Card_equipmentId_idx" ON "Card"("equipmentId");

-- CreateIndex
CREATE INDEX "Equipment_buildId_idx" ON "Equipment"("buildId");

-- CreateIndex
CREATE INDEX "Stone_equipmentId_idx" ON "Stone"("equipmentId");

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "BuildStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobStatus" ADD CONSTRAINT "JobStatus_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombinedSet" ADD CONSTRAINT "CombinedSet_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombinedSetEffect" ADD CONSTRAINT "CombinedSetEffect_combinedSetId_fkey" FOREIGN KEY ("combinedSetId") REFERENCES "CombinedSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
