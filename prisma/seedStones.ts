import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

export async function seedStonesBase() {
  const rawData = await readFile("./prisma/data/stone-data.json", "utf-8");
  const stonesList = JSON.parse(rawData);

  // console.log("Pedras do JSON:", stonesList.map((s: any) => s.stone));cl

  for (const stone of stonesList) {
    // console.log(`Upsert da pedra: ${stone.stone}`);

    await prisma.stoneBase.upsert({
      where: { stoneType: stone.stone },
      update: {
        data: stone.data,
      },
      create: {
        stoneType: stone.stone,
        data: stone.data,
      },
    });
  }

  const allStones = await prisma.stoneBase.findMany();
  console.log("Pedras no banco:", JSON.stringify(allStones, null, 2));
}
