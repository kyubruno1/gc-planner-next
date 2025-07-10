/*
  Warnings:

  - A unique constraint covering the columns `[setKey]` on the table `CombinedSetBase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CombinedSetBase_setKey_key" ON "CombinedSetBase"("setKey");
