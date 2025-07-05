/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CardBase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `EquipmentBase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CardBase_name_key" ON "CardBase"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentBase_name_key" ON "EquipmentBase"("name");
