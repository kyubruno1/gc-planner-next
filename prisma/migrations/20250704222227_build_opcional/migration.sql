-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_buildId_fkey";

-- AlterTable
ALTER TABLE "Equipment" ALTER COLUMN "buildId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE SET NULL ON UPDATE CASCADE;
