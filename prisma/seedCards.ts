import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

export async function seedCards() {
  const rawCards = await readFile("./prisma/data/cards.json", "utf-8");
  const cards = JSON.parse(rawCards);

  for (const card of cards) {
    await prisma.cardBase.upsert({
      where: { name: card.name },
      update: {},
      create: {
        name: card.name,
        type: card.type,
        equipType: card.equipType,
        img: card.img,
        effects: card.effects,
      },
    });
  }

  const allCards = await prisma.cardBase.findMany();
  console.log("Cartas no banco:", allCards);
}
