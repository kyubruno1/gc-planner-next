/*
  Warnings:

  - Added the required column `pieceCount` to the `CombinedSetEffectBase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CombinedSetEffectBase" ADD COLUMN     "pieceCount" INTEGER NOT NULL;
