/*
  Warnings:

  - You are about to drop the `CombinedSet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CombinedSetBase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CombinedSetEffect` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CombinedSetEffectBase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CombinedSet" DROP CONSTRAINT "CombinedSet_buildId_fkey";

-- DropForeignKey
ALTER TABLE "CombinedSetEffect" DROP CONSTRAINT "CombinedSetEffect_combinedSetId_fkey";

-- DropForeignKey
ALTER TABLE "CombinedSetEffectBase" DROP CONSTRAINT "CombinedSetEffectBase_combinedSetBaseId_fkey";

-- DropTable
DROP TABLE "CombinedSet";

-- DropTable
DROP TABLE "CombinedSetBase";

-- DropTable
DROP TABLE "CombinedSetEffect";

-- DropTable
DROP TABLE "CombinedSetEffectBase";

-- CreateTable
CREATE TABLE "BonusSetJson" (
    "id" TEXT NOT NULL,
    "bonusType" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "BonusSetJson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BonusSetJson_bonusType_key" ON "BonusSetJson"("bonusType");
