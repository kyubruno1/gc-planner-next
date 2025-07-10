/*
  Warnings:

  - You are about to drop the column `data` on the `BonusSetJson` table. All the data in the column will be lost.
  - Added the required column `bonuses` to the `BonusSetJson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `BonusSetJson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BonusSetJson" DROP COLUMN "data",
ADD COLUMN     "bonuses" JSONB NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "setPieces" TEXT[];
