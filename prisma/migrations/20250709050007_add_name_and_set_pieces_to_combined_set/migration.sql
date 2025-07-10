/*
  Warnings:

  - Added the required column `name` to the `CombinedSet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CombinedSet" DROP CONSTRAINT "CombinedSet_buildId_fkey";

-- AlterTable
ALTER TABLE "CombinedSet" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "setPieces" TEXT[],
ALTER COLUMN "buildId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CombinedSet" ADD CONSTRAINT "CombinedSet_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE SET NULL ON UPDATE CASCADE;
