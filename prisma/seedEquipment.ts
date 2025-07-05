import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

export async function seedEquipmentBase() {
  // Lê o arquivo JSON
  const rawData = await readFile("./prisma/data/equipment.json", "utf-8");
  const equipmentList = JSON.parse(rawData);

  console.log("Equipamentos do JSON:", equipmentList);

  for (const equip of equipmentList) {
    console.log(`Criando equipamento: ${equip.name}`);

    // Para evitar conflito ao rodar várias vezes, usamos upsert
    await prisma.equipmentBase.upsert({
      where: { name: equip.name },
      update: equip,
      create: equip,
    });
  }

  // Opcional: buscar tudo e mostrar no console para validar
  const allEquip = await prisma.equipmentBase.findMany();
  console.log("Equipamentos no banco:", JSON.stringify(allEquip, null, 2));
}
