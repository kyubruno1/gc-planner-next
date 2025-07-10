import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

export async function seedBonusSetJson() {
  console.log("=== INICIANDO SEED DE BONUS SETS ===");

  const rawData = await readFile("./prisma/data/bonus-set.json", "utf-8");
  const bonusSetsJson = JSON.parse(rawData);

  for (const set of bonusSetsJson) {
    // Checa se já existe no banco
    const existingSet = await prisma.bonusSetJson.findUnique({
      where: { bonusType: set.bonusType },
    });

    if (existingSet) {
      console.log(`Set já existe, pulando: bonusType=${set.bonusType} | name=${set.name}`);
      continue;
    }

    // Extrai os efeitos numéricos (por quantidade de peças)
    const bonuses: Record<string, any> = {};
    for (const key of Object.keys(set)) {
      if (/^\d+$/.test(key)) {
        bonuses[key] = set[key];
      }
    }

    await prisma.bonusSetJson.create({
      data: {
        bonusType: set.bonusType,
        name: set.name,
        setPieces: set.setPieces,
        bonuses,
      },
    });

    console.log(`Set criado: bonusType=${set.bonusType} | name=${set.name}`);
  }

  console.log("Seed de BonusSetJson concluído.");
}
