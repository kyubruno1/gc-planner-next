/*
  Warnings:

  - You are about to alter the column `hell_spear` on the `BuildStatus` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `buildId` on table `CombinedSet` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CombinedSet" DROP CONSTRAINT "CombinedSet_buildId_fkey";

-- AlterTable
ALTER TABLE "BuildStatus" ALTER COLUMN "hell_spear" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "CombinedSet" ALTER COLUMN "buildId" SET NOT NULL;

-- CreateTable
CREATE TABLE "CombinedSetBase" (
    "id" TEXT NOT NULL,
    "setKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "setPieces" TEXT[],

    CONSTRAINT "CombinedSetBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CombinedSetEffectBase" (
    "id" TEXT NOT NULL,
    "combinedSetBaseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CombinedSetEffectBase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CombinedSetBase_setKey_key" ON "CombinedSetBase"("setKey");

-- AddForeignKey
ALTER TABLE "CombinedSetEffectBase" ADD CONSTRAINT "CombinedSetEffectBase_combinedSetBaseId_fkey" FOREIGN KEY ("combinedSetBaseId") REFERENCES "CombinedSetBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombinedSet" ADD CONSTRAINT "CombinedSet_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
