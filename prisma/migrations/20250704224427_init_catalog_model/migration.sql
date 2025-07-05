/*
  Warnings:

  - You are about to drop the column `statusId` on the `Build` table. All the data in the column will be lost.
  - You are about to drop the column `effects` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `equipType` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `Stone` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentId` on the `Stone` table. All the data in the column will be lost.
  - You are about to drop the column `stoneType` on the `Stone` table. All the data in the column will be lost.
  - You are about to drop the `Equipment` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `buildId` on table `BuildStatus` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `baseId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseId` to the `Stone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Build" DROP CONSTRAINT "Build_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_buildId_fkey";

-- DropForeignKey
ALTER TABLE "Stone" DROP CONSTRAINT "Stone_equipmentId_fkey";

-- DropIndex
DROP INDEX "Build_statusId_key";

-- DropIndex
DROP INDEX "Card_equipmentId_idx";

-- DropIndex
DROP INDEX "Stone_equipmentId_idx";

-- AlterTable
ALTER TABLE "Build" DROP COLUMN "statusId";

-- AlterTable
ALTER TABLE "BuildStatus" ALTER COLUMN "buildId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "effects",
DROP COLUMN "equipType",
DROP COLUMN "equipmentId",
DROP COLUMN "img",
DROP COLUMN "name",
DROP COLUMN "type",
ADD COLUMN     "baseId" TEXT NOT NULL,
ADD COLUMN     "buildEquipmentId" TEXT,
ADD COLUMN     "effectsOverride" JSONB;

-- AlterTable
ALTER TABLE "Stone" DROP COLUMN "data",
DROP COLUMN "equipmentId",
DROP COLUMN "stoneType",
ADD COLUMN     "baseId" TEXT NOT NULL,
ADD COLUMN     "buildEquipmentId" TEXT,
ADD COLUMN     "dataOverride" JSONB;

-- DropTable
DROP TABLE "Equipment";

-- CreateTable
CREATE TABLE "EquipmentBase" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "bonusType" TEXT,
    "equipType" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "equipLvl" INTEGER NOT NULL,
    "img" TEXT NOT NULL,
    "total_attack" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "crit_chance" DOUBLE PRECISION NOT NULL,
    "crit_damage" DOUBLE PRECISION NOT NULL,
    "sp_attack" INTEGER NOT NULL,
    "mp_rec" DOUBLE PRECISION NOT NULL,
    "hell_spear_chance" DOUBLE PRECISION NOT NULL,
    "hell_spear" INTEGER NOT NULL,
    "taint_resistance" DOUBLE PRECISION NOT NULL,
    "defense" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "crit_resistance" DOUBLE PRECISION NOT NULL,
    "sp_def" INTEGER NOT NULL,
    "hp_rec" INTEGER NOT NULL,
    "counter_attack_resistance" DOUBLE PRECISION NOT NULL,
    "exp" INTEGER NOT NULL,
    "gp" DOUBLE PRECISION NOT NULL,
    "props" JSONB,
    "statusNeck" JSONB,

    CONSTRAINT "EquipmentBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildEquipment" (
    "id" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "baseId" TEXT NOT NULL,
    "propsOverride" JSONB,

    CONSTRAINT "BuildEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardBase" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT[],
    "equipType" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "effects" JSONB NOT NULL,

    CONSTRAINT "CardBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoneBase" (
    "id" TEXT NOT NULL,
    "stoneType" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "StoneBase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BuildEquipment_buildId_idx" ON "BuildEquipment"("buildId");

-- CreateIndex
CREATE INDEX "BuildEquipment_baseId_idx" ON "BuildEquipment"("baseId");

-- CreateIndex
CREATE INDEX "Card_buildEquipmentId_idx" ON "Card"("buildEquipmentId");

-- CreateIndex
CREATE INDEX "Stone_buildEquipmentId_idx" ON "Stone"("buildEquipmentId");

-- AddForeignKey
ALTER TABLE "BuildEquipment" ADD CONSTRAINT "BuildEquipment_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildEquipment" ADD CONSTRAINT "BuildEquipment_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "EquipmentBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_buildEquipmentId_fkey" FOREIGN KEY ("buildEquipmentId") REFERENCES "BuildEquipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "CardBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stone" ADD CONSTRAINT "Stone_buildEquipmentId_fkey" FOREIGN KEY ("buildEquipmentId") REFERENCES "BuildEquipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stone" ADD CONSTRAINT "Stone_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "StoneBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildStatus" ADD CONSTRAINT "BuildStatus_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
