/*
  Warnings:

  - A unique constraint covering the columns `[stoneType]` on the table `StoneBase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StoneBase_stoneType_key" ON "StoneBase"("stoneType");
